package com.itcen.emergencyroad.community.entity;

import com.itcen.emergencyroad.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "comments")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Getter
public class Comment extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "comment_id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  private Post post;

  @Column(name = "content", nullable = false, length = 500)
  private String content;

  @Column(name = "is_deleted", nullable = false)
  private boolean isDeleted = false;

  public static Comment create(Post post, User user, String content){
    Comment comment = new Comment();
    comment.post = post;
    comment.user = user;
    comment.content = content;

    return comment;
  }

  public void update(String content){
    this.content = content;
  }

  public void delete(){
    this.isDeleted = true;
  }
}
