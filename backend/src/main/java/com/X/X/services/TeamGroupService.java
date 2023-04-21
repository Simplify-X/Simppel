package com.X.X.services;

import com.X.X.config.ResourceNotFoundException;
import com.X.X.domains.AdvertisementAccess;
import com.X.X.domains.CopyWritingAccess;
import com.X.X.domains.TeamGroup;
import com.X.X.domains.TeamGroupMember;
import com.X.X.repositories.TeamGroupMemberRepository;
import com.X.X.repositories.TeamGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public class TeamGroupService {
    @Autowired
    private TeamGroupRepository teamGroupRepository;

    @Autowired
    private TeamGroupMemberRepository teamGroupMemberRepository;

    public TeamGroup saveTeam(TeamGroup teamGroup) {
        return teamGroupRepository.save(teamGroup);
    }

    public List<TeamGroup> getTeam(UUID accountId) {
        return teamGroupRepository.findByAccountId(accountId);
    }

    public TeamGroup updateTeam(TeamGroup teamGroup, UUID id) {
        TeamGroup team = teamGroupRepository.findByGroupId(id);

        if(team == null){
            throw new ResourceNotFoundException("No Team Group found with : " + id);
        }
        team.setAdvertisementAccess(AdvertisementAccess.fromString(String.valueOf(teamGroup.getAdvertisementAccess())));
        team.setCopyWritingAccess(CopyWritingAccess.fromString(String.valueOf(teamGroup.getCopyWritingAccess())));
        team.setGroupName(teamGroup.getGroupName());
        team.setDescription(teamGroup.getDescription());
        team.setAccountId(team.getAccountId());

        return teamGroupRepository.save(team);
    }

    public void deleteTeamGroup(UUID id){
        TeamGroup team = teamGroupRepository.findByGroupId(id);
        List<TeamGroupMember> teamMember = teamGroupMemberRepository.findByUserId(id);


        if (team == null && teamMember == null) {
            throw new ResourceNotFoundException("No Team Group found with : " + id);
        }
        for (TeamGroupMember member : teamMember) {
            teamGroupMemberRepository.delete(member);
        }
        teamGroupRepository.delete(team);

    }

    public List<TeamGroup> getAllTeam() {
        return teamGroupRepository.findAll();
    }

    public TeamGroup getTeamList(UUID accountId) {
        return teamGroupRepository.findByGroupId(accountId);
    }

}
