package com.portfolio.backend.controller;

import com.portfolio.backend.model.*;
import com.portfolio.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PortfolioController {

    @Autowired private ProfileRepository profileRepository;
    @Autowired private SkillRepository skillRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private ExperienceRepository experienceRepository;
    @Autowired private ContactMessageRepository contactMessageRepository;

    // --- Profile ---
    @GetMapping("/profile")
    public Profile getProfile() {
        return profileRepository.findById(1L).orElse(null);
    }

    @PutMapping("/profile")
    public Profile updateProfile(@RequestBody Profile profile) {
        profile.setId(1L);
        return profileRepository.save(profile);
    }

    // --- Skills ---
    @GetMapping("/skills")
    public List<Skill> getSkills() {
        return skillRepository.findAll();
    }
    
    @PostMapping("/skills")
    public Skill addSkill(@RequestBody Skill skill) {
        return skillRepository.save(skill);
    }

    @DeleteMapping("/skills/{id}")
    public void deleteSkill(@PathVariable Long id) {
        skillRepository.deleteById(id);
    }

    // --- Projects ---
    @GetMapping("/projects")
    public List<Project> getProjects() {
        return projectRepository.findAll();
    }
    
    @PostMapping("/projects")
    public Project addProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    @PutMapping("/projects/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project project) {
        project.setId(id);
        return projectRepository.save(project);
    }

    @DeleteMapping("/projects/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectRepository.deleteById(id);
    }

    // --- Experience ---
    @GetMapping("/experience")
    public List<Experience> getExperience() {
        return experienceRepository.findAll();
    }

    @PostMapping("/experience")
    public Experience addExperience(@RequestBody Experience exp) {
        return experienceRepository.save(exp);
    }

    @DeleteMapping("/experience/{id}")
    public void deleteExperience(@PathVariable Long id) {
        experienceRepository.deleteById(id);
    }

    // --- Contact ---
    @PostMapping("/contact")
    public ContactMessage sendContact(@RequestBody ContactMessage msg) {
        return contactMessageRepository.save(msg);
    }
}
