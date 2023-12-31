package com.X.X.services;

import com.X.X.config.ResourceNotFoundException;
import com.X.X.domains.TeamGroup;
import com.X.X.domains.TeamGroupMember;
import com.X.X.domains.User;
import com.X.X.repositories.TeamGroupMemberRepository;
import com.X.X.repositories.TeamGroupRepository;
import com.X.X.repositories.UserRepository;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public class TeamGroupMemberService {
    @Autowired
    private TeamGroupMemberRepository teamGroupMemberRepository;

    @Autowired
    private UserRepository userRepository;

    public TeamGroupMember saveTeamMember(TeamGroupMember teamGroupMember) {
        User user = userRepository.findByUserId(teamGroupMember.getUserId());
        teamGroupMember.setUsername(user.getUsername());
        user.setIsLinkedToTeamGroup(true);
        return teamGroupMemberRepository.save(teamGroupMember);
    }

    public List <TeamGroupMember> getTeamMember(UUID accountId) {
        return teamGroupMemberRepository.findByUserId(accountId);
    }


    public TeamGroupMember getSingleTeamGroupMember(UUID userId) {
        return teamGroupMemberRepository.findByUserIds(userId);
    }

    public void deleteTeamMember(UUID userId, UUID userDetailId) {
        User user = userRepository.findByUserId(userDetailId);
        user.setIsLinkedToTeamGroup(false);
        val teamGroup = teamGroupMemberRepository.findByIds(userId);
        teamGroupMemberRepository.delete(teamGroup);
    }



    public List<TeamGroupMember> getAllTeamMember() {
        return teamGroupMemberRepository.findAll();
    }

}
