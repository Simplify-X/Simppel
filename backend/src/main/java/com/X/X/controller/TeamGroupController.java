package com.X.X.controller;


import com.X.X.domains.*;
import com.X.X.services.PostAutomationService;
import com.X.X.services.TeamGroupService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/groups")
public class TeamGroupController {

    @Autowired
    private TeamGroupService teamGroupService;

    @CrossOrigin
    @GetMapping("/{accountId}")
    @Operation(summary = "Get Team Groups", description = "Get all team groups for the specified user account.")
    public List<TeamGroup> getTeamGroup(@PathVariable UUID accountId) {
        return teamGroupService.getTeam(accountId);
    }

    @CrossOrigin
    @PostMapping("/create/{id}")
    @Operation(summary = "Create Team Groups", description = "Create a Team Group for the specified user account.")
    public TeamGroup createTeamGroup(@PathVariable UUID id, @RequestBody TeamGroup teamGroup) {
        teamGroup.setAccountId(id);

        teamGroup.setAdvertisementAccess(AdvertisementAccess.fromString(String.valueOf(teamGroup.getAdvertisementAccess())));
        teamGroup.setCopyWritingAccess(CopyWritingAccess.fromString(String.valueOf(teamGroup.getCopyWritingAccess())));
        teamGroup.setSpyToolAccess(SpyToolAccess.fromString(String.valueOf(teamGroup.getSpyToolAccess())));

        return teamGroupService.saveTeam(teamGroup);
    }

    @CrossOrigin
    @PutMapping("/update/{id}/{accountId}")
    @Operation(summary = "Create Team Groups", description = "Create a Team Group for the specified user account.")
    public TeamGroup editTeamGroup(@PathVariable UUID id,@PathVariable UUID accountId,  @RequestBody TeamGroup teamGroup) {
        teamGroup.setAccountId(accountId);
        return teamGroupService.updateTeam(teamGroup, id);
    }

    @CrossOrigin
    @DeleteMapping("/delete/{id}")
    public void deleteTeam(@PathVariable UUID id) {
        teamGroupService.deleteTeamGroup(id);

    }

    @CrossOrigin
    @GetMapping("/list/{accountId}")
    @Operation(summary = "Get Team Groups", description = "Get all team groups for the specified user account.")
    public TeamGroup getTeamGroupList(@PathVariable UUID accountId) {
        return teamGroupService.getTeamList(accountId);
    }




}
