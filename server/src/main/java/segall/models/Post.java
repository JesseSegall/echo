package segall.models;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.Objects;

public class Post {
    private Long id;
    private Long userId;
    private Long bandId;
    @NotBlank(message = "Message body is required")
    private String body;
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBandId() {
        return bandId;
    }

    public void setBandId(Long bandId) {
        this.bandId = bandId;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Post post = (Post) o;
        return Objects.equals(id, post.id) && Objects.equals(userId, post.userId) && Objects.equals(bandId, post.bandId) && Objects.equals(body, post.body) && Objects.equals(createdAt, post.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, userId, bandId, body, createdAt);
    }
}
