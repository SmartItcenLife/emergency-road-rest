package com.itcen.emergencyroad.recommend.dto.projection;

import com.itcen.emergencyroad.general.entity.GeneralMkioskty;
import com.itcen.emergencyroad.general.entity.GeneralStandard;
import com.itcen.emergencyroad.general.entity.GeneralRealtime;

public interface GeneralHospitalProjection extends HospitalDataProjection{

    GeneralMkioskty getGeneralMkioskty();
    GeneralRealtime  getGeneralRealtime();
    GeneralStandard getGeneralStandard();

}
