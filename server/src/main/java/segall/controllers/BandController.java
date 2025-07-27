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


    // TODO need to make sure only the correct band can upload or delete songs/albums
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


}
