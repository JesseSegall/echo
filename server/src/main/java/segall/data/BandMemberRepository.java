package segall.data;

import segall.models.BandMember;

import java.util.List;

public interface BandMemberRepository {
    BandMember addBandMember(BandMember bandMember);
    List<BandMember> findAllMembersByBandId(Long bandId);
    boolean removeMember(Long bandId, Long userId);
}
