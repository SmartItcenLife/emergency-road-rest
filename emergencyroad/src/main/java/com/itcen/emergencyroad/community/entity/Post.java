package com.itcen.emergencyroad.community.entity;

import com.itcen.emergencyroad.global.entity.BaseEntity;
import com.itcen.emergencyroad.hospital.entity.Hospital;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hpid", nullable = false)
    private Hospital hospital;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "content",nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    public void delete(){
        this.isDeleted = true; // Soft Delete
    }

    public static Post create(User user, Hospital hospital, String title, String content){
        Post post = new Post();
        post.user = user;
        post.hospital = hospital;
        post.title = title;
        post.content = content;

        return post;
    }

    public void update(String title, String content){
        this.title = title;
        this.content = content;
    }

}
