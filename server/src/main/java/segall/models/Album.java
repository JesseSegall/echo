package segall.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;


public class Album {
    private Long id;
    private Long bandId;
    private String title;
    private LocalDate releaseDate;
    private String coverUrl;
    private String coverKey;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public String getCoverKey() {
        return coverKey;
    }

    public void setCoverKey(String coverKey) {
        this.coverKey = coverKey;
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
        Album album = (Album) o;
        return Objects.equals(id, album.id) && Objects.equals(bandId, album.bandId) && Objects.equals(title, album.title) && Objects.equals(releaseDate, album.releaseDate) && Objects.equals(coverUrl, album.coverUrl) && Objects.equals(coverKey, album.coverKey) && Objects.equals(createdAt, album.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, bandId, title, releaseDate, coverUrl, coverKey, createdAt);
    }
}
