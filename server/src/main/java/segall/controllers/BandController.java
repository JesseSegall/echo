
package segall.controllers;


import segall.domain.BandService;
import segall.domain.Result;


import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import segall.domain.SongService;
import segall.models.Band;
import segall.models.BandMember;
import segall.models.Song;
import segall.utils.JwtUtil;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/band")

public class BandController {

    private final SongService songService;
    private final BandService bandService;
    private final JwtUtil jwtUtil;

    public BandController(SongService songService, BandService bandService, JwtUtil jwtUtil) {
        this.songService = songService;
        this.bandService = bandService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<Object> createBand(
            @RequestBody Band band,
            @RequestHeader Map<String, String> headers
    ) {
        Integer userId = jwtUtil.getUserIdFromHeaders(headers);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Result<Band> result = bandService.createBand(band, userId.longValue());
        if (!result.isSuccess()) {
            return ResponseEntity
                    .badRequest()
                    .body(result.getErrorMessages());
        }
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(result.getpayload());
    }
    @GetMapping("/{bandId}")
    public ResponseEntity<Object> getBandById(@PathVariable Long bandId) {
        Band band = bandService.findById(bandId);
        if (band == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(band);
    }

    @PutMapping(value = "/{bandId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> updateBand(
            @PathVariable Long bandId,
            @RequestPart("band") Band band,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            @RequestHeader Map<String, String> headers
    ) {
        Integer userId = jwtUtil.getUserIdFromHeaders(headers);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (!bandId.equals(band.getId())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Result<Band> result = bandService.updateBand(band, photo);
        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getErrorMessages(), HttpStatus.BAD_REQUEST);
        }
        return ResponseEntity.ok(result.getpayload());
    }

    @DeleteMapping("/{bandId}")
    public ResponseEntity<Object> deleteBand(
            @PathVariable Long bandId,
            @RequestHeader Map<String, String> headers
    ) {
        Integer userId = jwtUtil.getUserIdFromHeaders(headers);
        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        boolean deleted = bandService.deleteById(bandId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{bandId}/members")
    public ResponseEntity<Object> getMembers(@PathVariable Long bandId) {
        List<BandMember> members = bandService.findAllMembersByBandId(bandId);
        return ResponseEntity.ok(members);
    }

    @DeleteMapping("/{bandId}/members/self")
    public ResponseEntity<Object> leaveBand(
            @PathVariable Long bandId,
            @RequestHeader Map<String, String> headers
    ) {
        Integer self = jwtUtil.getUserIdFromHeaders(headers);
        if (self == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean removed = bandService.removeMember(bandId, self.longValue());
        if (removed) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
   // Need this hack to get to a band profile, we are basically having a user profile act as a band.
    @GetMapping("/self")
    public ResponseEntity<List<Band>> getMyBands(@RequestHeader Map<String,String> headers) {
        Integer userId = jwtUtil.getUserIdFromHeaders(headers);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<BandMember> memberships = bandService.findAllMembersByUserId(userId.longValue());
        // filter owner roles now to see if they are actually a band
        List<Long> ownedBandIds = memberships.stream()
                .filter(m -> "owner".equals(m.getRole()))
                .map(BandMember::getBandId)
                .toList();

        if (ownedBandIds.isEmpty()) return ResponseEntity.ok(List.of());
        List<Band> bands = ownedBandIds.stream()
                .map(bandService::findById)
                .toList();
        return ResponseEntity.ok(bands);
    }




    @PostMapping(value = "/{bandId}/songs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> addBandSong(
            @PathVariable Long bandId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("albumId") Long albumId,
            @RequestParam("title") String title,
            @RequestHeader Map<String, String> headers
    ) {

        Integer idFromHeaders = jwtUtil.getUserIdFromHeaders(headers);
        if (idFromHeaders == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }


        boolean isOwner = bandService
                .findAllMembersByBandId(bandId)
                .stream()
                .anyMatch(m ->
                        m.getUserId().equals(idFromHeaders.longValue()) && "owner".equals(m.getRole()));
        if (!isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }


        Result<Song> result = songService.addBandSong(file, bandId, albumId, title);
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
