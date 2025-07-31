package segall.data;

import segall.models.Band;

import java.util.List;

public interface BandRepository {
    Band create(Band band);
    Band findById(Long bandId);
    boolean updateBand(Band band);
    List<Band> getAllBands();
    boolean deleteById(Long bandId);
}
