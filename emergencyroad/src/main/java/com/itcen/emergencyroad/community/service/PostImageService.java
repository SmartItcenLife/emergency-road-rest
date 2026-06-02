package com.itcen.emergencyroad.community.service;

import com.itcen.emergencyroad.community.entity.Post;
import com.itcen.emergencyroad.community.entity.PostImage;
import com.itcen.emergencyroad.community.repository.PostImageRepository;
import com.itcen.emergencyroad.global.exception.CustomException;
import com.itcen.emergencyroad.global.exception.ExceptionStatus;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostImageService {

  private final PostImageRepository postImageRepository;

  private static final String UPLOAD_DIR = "uploads/";
  private static final int MAX_IMAGE_COUNT = 3;
  private static final List<String> ALLOWED_TYPES = List.of(
      "image/jpeg", "image/jpg", "image/png", "image/gif"
  );

  @Transactional
  public void uploadImages(Post post, List<MultipartFile> images) {
    if (images == null || images.isEmpty()) {
      return;
    }

    List<MultipartFile> validImages = images.stream()
        .filter(image -> !image.isEmpty())
        .toList();

    if (validImages.isEmpty()) {
      return;
    }

    if (validImages.size() > MAX_IMAGE_COUNT) {
      throw new CustomException(ExceptionStatus.IMAGE_LIMIT_EXCEEDED);
    }

    for (MultipartFile image : validImages) {
      if (!ALLOWED_TYPES.contains(image.getContentType())) {
        throw new CustomException(ExceptionStatus.UNSUPPORTED_MEDIA_TYPE);
      }

      String imageUrl = saveFile(image);
      PostImage postImage = PostImage.builder()
          .post(post)
          .imageUrl(imageUrl)
          .build();

      postImageRepository.save(postImage);
    }
  }

  @Transactional
  public void deleteImages(Long postId) {
    postImageRepository.deleteByPost_Id(postId);
  }

  public Map<Long, List<String>> getImageUrlMap(List<Long> postIds) {
    return postImageRepository.findByPost_IdInOrderByCreatedAtAsc(postIds)
        .stream()
        .collect(Collectors.groupingBy(
            image -> image.getPost().getId(),
            Collectors.mapping(PostImage::getImageUrl, Collectors.toList())
        ));
  }

  private String saveFile(MultipartFile file) {
    try {
      Path uploadPath = Path.of(System.getProperty("user.dir"), UPLOAD_DIR);

      if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
      }

      String originalFileName = file.getOriginalFilename();
      String fileName = UUID.randomUUID() + "_" + originalFileName;

      Path filepath = uploadPath.resolve(fileName);
      file.transferTo(filepath.toFile());

      return "/" + UPLOAD_DIR + fileName;
    } catch (IOException e) {
      throw new CustomException(ExceptionStatus.FILE_UPLOAD_FAILED);
    }
  }
}
