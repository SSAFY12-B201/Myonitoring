package com.myaicrosoft.myonitoring.model.entity;

import jakarta.persistence.*;
import lombok.*;
import com.myaicrosoft.myonitoring.model.entity.User;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "fcm_tokens")
public class FcmToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(value = ConstraintMode.CONSTRAINT, foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"))
    private User user;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Builder
    public FcmToken(String token, User user) {
        this.token = token;
        this.user = user;
    }

    public void deactivate() {
        this.isActive = false;
    }
}