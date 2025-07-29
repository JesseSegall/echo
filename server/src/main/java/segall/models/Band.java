package segall.models;

import java.time.LocalDateTime;

public class Band {
    private Long id;
    private String name;
    private String bandImgUrl;
    private String genre;
    private String bio;
    private String city;
    private String state;
    private String zipcode;
    private boolean needsNewMember;
    private LocalDateTime createdAt;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBandImgUrl() {
        return bandImgUrl;
    }

    public void setBandImgUrl(String bandImgUrl) {
        this.bandImgUrl = bandImgUrl;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }

    public boolean isNeedsNewMember() {
        return needsNewMember;
    }

    public void setNeedsNewMember(boolean needsNewMember) {
        this.needsNewMember = needsNewMember;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
