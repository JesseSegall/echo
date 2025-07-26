// src/main/java/segall/controllers/SongController.java
package segall.controllers;


import segall.domain.Result;


import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import segall.domain.SongService;
import segall.models.Song;

@RestController
@RequestMapping("/api/band")

public class BandController {

    private final SongService songService;

    public BandController(SongService songService) {
        this.songService = songService;
    }

    /**
     * Upload a new song: file + metadata.
     * Returns 201 with the Song on success, or 400 with validation errors.
     */
    @PostMapping(value="/{bandId}/songs",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> addBandSong(
            @PathVariable Long bandId,
            @RequestParam("file")            MultipartFile file,
            @RequestParam("albumId")         Long albumId,
            @RequestParam("title")           String title

    ) {
        Result<Song> result = songService.addBandSong(
                file, bandId, albumId, title
        );

        if (!result.isSuccess()) {
            return ResponseEntity
                    .badRequest()
                    .body(result.getErrorMessages());
        }
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(result.getpayload());
    }

    /** Get a single song by ID (404 if not found) */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getSong(@PathVariable Long id) {
        try {
            Song song = songService.getSongById(id);
            return ResponseEntity.ok(song);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    /** Delete a song (removes from S3 + DB) */
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteSong(@PathVariable Long id) {
//        try {
//            songService.deleteById(id);
//            return ResponseEntity.noContent().build();
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity
//                    .status(HttpStatus.NOT_FOUND)
//                    .body(e.getMessage());
//        } catch (Exception e) {
//            return ResponseEntity
//                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Failed to delete song: " + e.getMessage());
//        }
//    }
}
