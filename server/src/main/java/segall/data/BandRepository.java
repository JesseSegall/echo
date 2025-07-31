package segall.data;

import segall.models.Band;

public interface BandRepository {
    Band create(Band band);
    Band findById(Long bandId);
    boolean updateBand(Band band);

    boolean deleteById(Long bandId);
}
