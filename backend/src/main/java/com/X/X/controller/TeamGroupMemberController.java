package com.X.X.controller;


import com.X.X.domains.Advertisement;
import com.X.X.domains.PostAutomation;
import com.X.X.domains.TeamGroup;
import com.X.X.domains.TeamGroupMember;
import com.X.X.services.PostAutomationService;
import com.X.X.services.TeamGroupMemberService;
import com.X.X.services.TeamGroupService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/groups/members")
public class TeamGroupMemberController {

    @Autowired
    private TeamGroupMemberService teamGroupMemberService;

    @CrossOrigin
    @GetMapping("/{accountId}")
    @Operation(summary = "Get Team Groups", description = "Get all team groups for the specified user account.")
    public List<TeamGroupMember> getTeamGroup(@PathVariable UUID accountId) {
        return teamGroupMemberService.getTeamMember(accountId);
    }

    @CrossOrigin
    @PostMapping("/create/{id}")
    @Operation(summary = "Create Team Groups", description = "Create a Team Group for the specified user account.")
    public TeamGroupMember createTeamGroup(@PathVariable UUID id, @RequestBody TeamGroupMember teamGroupMember) {
        return teamGroupMemberService.saveTeamMember(teamGroupMember);
    }

    @CrossOrigin
    @GetMapping("/getInvitedUsers")
    @Operation(summary = "Create Team Groups", description = "Create a Team Group for the specified user account.")
    public List <TeamGroupMember> getInvitedUsers() {
        return teamGroupMemberService.getAllTeamMember();
    }

    @CrossOrigin
    @GetMapping("/list/{userId}")
    @Operation(summary = "Get Team Groups", description = "Get all team groups for the specified user account.")
    public TeamGroupMember getSingleTeamGroupMember(@PathVariable UUID userId) {
        return teamGroupMemberService.getSingleTeamGroupMember(userId);
    }

    @CrossOrigin
    @DeleteMapping("/delete/{userId}/{userDetailId}")
    @Operation(summary = "Delete Team Group Member", description = "Delete a Team Group Member by user ID.")
    public void deleteTeamGroupMember(@PathVariable UUID userId, @PathVariable UUID userDetailId) {
        teamGroupMemberService.deleteTeamMember(userId, userDetailId);
    }


}
