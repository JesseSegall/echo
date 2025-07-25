package segall.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;


public class Album {
    private Long id;
    private Long bandId;
    private String title;
    private LocalDate releaseDate;
    private String cover_url;
    private String cover_key;
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

    public String getCover_url() {
        return cover_url;
    }

    public void setCover_url(String cover_url) {
        this.cover_url = cover_url;
    }

    public String getCover_key() {
        return cover_key;
    }

    public void setCover_key(String cover_key) {
        this.cover_key = cover_key;
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
        return Objects.equals(id, album.id) && Objects.equals(bandId, album.bandId) && Objects.equals(title, album.title) && Objects.equals(releaseDate, album.releaseDate) && Objects.equals(cover_url, album.cover_url) && Objects.equals(cover_key, album.cover_key) && Objects.equals(createdAt, album.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, bandId, title, releaseDate, cover_url, cover_key, createdAt);
    }
}
