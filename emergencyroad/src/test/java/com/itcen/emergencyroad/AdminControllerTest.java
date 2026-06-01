package com.itcen.emergencyroad;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AdminControllerTest {

    @LocalServerPort
    private int port;

    private final RestTemplate restTemplate = new RestTemplate();

    @Test
    void adminMain() {
        String response = restTemplate.getForObject(
                "http://localhost:" + port + "/api/admin",
                String.class
        );

        System.out.println(response);

        assertThat(response).contains("todayUsers");
        assertThat(response).contains("todayPosts");
        assertThat(response).contains("totalReports");
    }

    @Test
    void getUserList(){
        String response = restTemplate.getForObject(
                "http://localhost:" + port + "/api/admin/users",
                String.class
        );

        System.out.println(response.replace("},{", "\n{"));

        assertThat(response).contains("id");
        assertThat(response).contains("userName");
        assertThat(response).contains("nickname");
        assertThat(response).contains("role");
        assertThat(response).contains("email");
        assertThat(response).contains("createdAt");

    }
}