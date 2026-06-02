package com.itcen.emergencyroad.community.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.itcen.emergencyroad.community.enums.LoginType;
import com.itcen.emergencyroad.community.enums.Role;
import com.itcen.emergencyroad.global.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class User extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Long id;

  @Column(name = "user_name", unique = true, length = 20)
  private String userName;

  @JsonIgnore
  @Column(length = 255)
  private String password;

  @Column(nullable = false, length = 30, unique = true)
  private String nickname;

  @Column(length = 100, unique = true)
  private String email;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 10)
  private LoginType loginType;

  @Column(length = 500)
  private String profileImageUrl;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 10)
  private Role role;

  @JsonIgnore
  @Column(length = 50)
  private String kakaoId;

  public void updateKakaoProfile(String nickname, String profileImageUrl) {
    if(nickname != null && !nickname.isBlank()){
      this.nickname = nickname;
    }
    if(profileImageUrl != null){
      this.profileImageUrl = profileImageUrl;
    }
  }

  public void updateProfileImage(String imageUrl) {
    this.profileImageUrl = imageUrl;
  }

  public void updateNickname(String nickname) {
    this.nickname = nickname;
  }
}
