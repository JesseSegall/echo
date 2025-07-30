package segall.domain;


import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import segall.data.BandJdbcClientRepository;
import segall.data.BandMemberJdbcClientRepository;
import segall.models.Band;
import segall.models.BandMember;
import segall.storage.StorageService;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Service
public class BandService {
    private final BandJdbcClientRepository bandRepository;
    private final BandMemberJdbcClientRepository bandMemberRepository;
    private final StorageService storageService;
    public BandService(BandJdbcClientRepository bandRepository, BandMemberJdbcClientRepository bandMemberRepository, StorageService storageService) {
        this.bandRepository = bandRepository;
        this.bandMemberRepository = bandMemberRepository;
        this.storageService = storageService;
    }

    public Result<Band> createBand(Band band, Long creatorUserId){
        Result<Band> result = new Result<>();
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<Band>> violations = validator.validate(band);

        if (!violations.isEmpty()) {
            for (ConstraintViolation<Band> violation : violations) {
                result.addErrorMessage(violation.getMessage(), ResultType.INVALID);
            }
        }

        if (result.isSuccess()) {
            Band created = bandRepository.create(band);
            bandMemberRepository.addBandMember(new BandMember(
                    created.getId(),
                    creatorUserId,
                    "owner"
            ));
            result.setpayload(created);
        }

        return result;

    }

    public Result<Band> updateBand(Band band, MultipartFile bandPhoto) {
        Result<Band> result = new Result<>();


        Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
        Set<ConstraintViolation<Band>> violations = validator.validate(band);
        for (ConstraintViolation<Band> v : violations) {
            result.addErrorMessage(v.getMessage(), ResultType.INVALID);
        }


        if (result.isSuccess()) {
            try {
                if (bandPhoto != null && !bandPhoto.isEmpty()) {

                    String photoUrl = storageService.upload(
                            bandPhoto,
                            "band",
                            band.getId(),
                            "photos"
                    );
                    band.setBandImgUrl(photoUrl);
                }


                boolean updated = bandRepository.updateBand(band);
                if (updated) {
                    result.setpayload(band);
                } else {
                    result.addErrorMessage("Failed to update band", ResultType.NOT_FOUND);
                }
            } catch (IOException ioe) {
                result.addErrorMessage(
                        "Could not upload band photo: %s",
                        ResultType.INVALID,
                        ioe.getMessage()
                );
            } catch (Exception ex) {
                result.addErrorMessage(
                        "Could not update band: %s",
                        ResultType.INVALID,
                        ex.getMessage()
                );
            }
        }

        return result;
    }

    public Band findById(Long bandId) {
        Band band = bandRepository.findById(bandId);
        if (band == null) {
            return null;
        }

        List<BandMember> members = bandMemberRepository.findAllMembersByBandId(bandId);

        for (BandMember m : members) {
            if ("owner".equalsIgnoreCase(m.getRole())) {
                band.setOwnerId(m.getUserId());
                break;
            }
        }

        return band;
    }
    public List<BandMember> findAllMembersByUserId(Long userId){
        return bandMemberRepository.findAllByUserId(userId);
    }


    public boolean deleteById(Long bandId){
        return bandRepository.deleteById(bandId);
    }

    // Band member methods

    public List<BandMember> findAllMembersByBandId(Long bandId){
        return bandMemberRepository.findAllMembersByBandId(bandId);
    }

    public boolean removeMember(Long bandId, Long userId){
        return bandMemberRepository.removeMember(bandId,userId);
    }



}
