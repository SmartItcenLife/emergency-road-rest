 // GPS 조회 커스텀 훅
 import { useState } from "react";

export function useLocation() {

    const [location, setLocation] =
        useState(null);

    const getLocation = () => {

        return new Promise(
            (resolve, reject) => {

            navigator.geolocation.getCurrentPosition(

                (position) => {

                    const data = {

                        lat:
                        position.coords.latitude,

                        lon:
                        position.coords.longitude

                    };

                    setLocation(data);

                    resolve(data);
                },

                (error) => {

                    reject(error);

                }

            );

        });

    };

    return {
        location,
        getLocation
    };

}