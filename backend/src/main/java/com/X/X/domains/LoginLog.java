package com.X.X.domains;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "login_logs")
public class LoginLog extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "user_ip")
    private String userIp;

    @Column(name = "login_time")
    private LocalDateTime loginTime;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "request_timestamp")
    private LocalDateTime requestTimestamp;

    @Column(name = "result_status")
    private String resultStatus;

    @Column(name = "error_details")
    private String errorDetails;

}

