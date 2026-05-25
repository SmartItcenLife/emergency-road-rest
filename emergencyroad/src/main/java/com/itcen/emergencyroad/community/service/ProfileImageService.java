package com.itcen.emergencyroad.community.service;

import com.itcen.emergencyroad.global.exception.CustomException;
import com.itcen.emergencyroad.global.exception.ExceptionStatus;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileImageService {

  private static final String UPLOAD_DIR = "uploads/profiles/";
  private static final List<String> ALLOWED_TYPES = List.of(
      "image/jpeg", "image/jpg", "image/png"
  );

  public String uploadProfileImage(MultipartFile file){
    if(file == null || file.isEmpty()) return null;

    if(!ALLOWED_TYPES.contains(file.getContentType())){
      throw new CustomException(ExceptionStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    try{
      Path uploadPath = Path.of(System.getProperty("user.dir"),UPLOAD_DIR);
      Files.createDirectories(uploadPath);

      String originalFileName = file.getOriginalFilename();
      String fileName = UUID.randomUUID() + "_" + originalFileName;

      Path filepath = uploadPath.resolve(fileName);
      file.transferTo(filepath.toFile());

      return "/" + UPLOAD_DIR + fileName;
    }catch (IOException e){
      throw new CustomException(ExceptionStatus.FILE_UPLOAD_FAILED);
    }
  }
}


