package segall.models;

import java.time.LocalDateTime;

public class BandMember {
    private Long bandId;
    private Long userId;
    private String role;
    private LocalDateTime joinedAt;

    public BandMember() { }

    public BandMember(Long bandId, Long userId, String role) {
        this.bandId = bandId;
        this.userId = userId;
        this.role   = role;
    }
    public Long getBandId() {
        return bandId;
    }

    public void setBandId(Long bandId) {
        this.bandId = bandId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
