package segall.models;

import java.time.LocalDateTime;
import java.util.Objects;

public class Song {
    private Long id;
    private Long bandId;
    private Long albumId;
    private String title;
    private Integer durationSeconds;
    private String fileKey;
    private String fileUrl;
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBandId() {
        return bandId;
    }

    public void setBandId(Long bandId) {
        this.bandId = bandId;
    }

    public Long getAlbumId() {
        return albumId;
    }

    public void setAlbumId(Long albumId) {
        this.albumId = albumId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public String getFileKey() {
        return fileKey;
    }

    public void setFileKey(String fileKey) {
        this.fileKey = fileKey;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
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
        Song song = (Song) o;
        return Objects.equals(id, song.id) && Objects.equals(bandId, song.bandId) && Objects.equals(albumId, song.albumId) && Objects.equals(title, song.title) && Objects.equals(durationSeconds, song.durationSeconds) && Objects.equals(fileKey, song.fileKey) && Objects.equals(fileUrl, song.fileUrl) && Objects.equals(createdAt, song.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, bandId, albumId, title, durationSeconds, fileKey, fileUrl, createdAt);
    }
}
