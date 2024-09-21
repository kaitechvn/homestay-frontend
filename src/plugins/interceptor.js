import PAGES from "@/constants/pages";
import axiosInstance from "@/plugins/axios";
import routers from "@/routers";

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // If error message 'Token expired' -> refresh token
        if (error.response.data.message = "Token is expired") {
            console.log("Access token expired, trying to refresh it");
            try {
                console.log("Sending a POST request to the refresh token endpoint");
                const response = await axiosInstance.post(
                    "/auth/refresh-token",
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
                        },
                    },
                );
                console.log("New access token: ", response.data.accessToken);
                localStorage.setItem("access_token", response.data.accessToken);

                const { config } = error;
                config.headers.Authorization = `Bearer ${response.data.access_token}`;
                return axiosInstance.request(config);
            }
            catch (refreshError) {
                // If the refresh token is expired, then logout the user
                if(refreshError.response.data.message) {
                    console.log("Refresh token expired, logging out the user");
                    localStorage.removeItem("access-token");
                    localStorage.removeItem("refresh-token");

                    await routers.push({
                        path: PAGES.LOGIN,
                        query: { sessionExpired: true},
                    });
                }
            }
        }
    }
)