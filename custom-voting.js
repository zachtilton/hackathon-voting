
document.addEventListener('DOMContentLoaded', function() {
    const PROJECTS = [
        {
            id: 1,
            name: "Carrie's Inductive Code Creator (CICC)",
            team: "Carrie",
            challenge: "This is helping to streamline and remove analyst preconceptions from the process of inductive code tree generation for qualitative analysis.",
            description: "A qualitative analyst uploads the transcript of an interview or focus group to the CICC. The CICC then generates a list of inductively-generated codes with short descriptions of each one. They are separated out into themes first suggested by the interviewer and themes first suggested by the participant. This can be used as a summary tool, or the first step in generating a code schema for a project. But it can also be used to do a high-level comparison/contrast and integration of the themes found in different interviews and focus groups. This would then be used for generation of an overarching inductive code scheme to be used in human-led analysis.",
            link: "https://chatgpt.com/g/g-5yKJcD7yt-carrie-s-inductive-code-creator-cicc"
        },
        // Add the rest of your project data here...
    ];

    let currentIndex = 0;
    const projectVotes = {};

    PROJECTS.forEach(project => {
        projectVotes[project.id] = {
            ratings: {},
            comments: "",
            submitted: false
        };
    });

    document.querySelectorAll('.star-rating .star').forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.parentElement;
            const criterion = rating.dataset.criterion;
            const value = this.dataset.value;
            const projectId = PROJECTS[currentIndex].id;

            if (!projectVotes[projectId].submitted) {
                rating.querySelectorAll('.star').forEach(s => {
                    s.classList.remove('selected');
                    if (s.dataset.value <= value) s.classList.add('selected');
                });
                projectVotes[projectId].ratings[criterion] = parseInt(value);
                updateTotalScore();
            }
        });
    });

    function updateTotalScore() {
        const projectId = PROJECTS[currentIndex].id;
        const ratings = projectVotes[projectId].ratings;
        const total = Object.values(ratings).reduce((sum, value) => sum + (value * 4), 0);
        document.getElementById('totalScore').textContent = total + "%";
    }

    function updateProjectDisplay() {
        const project = PROJECTS[currentIndex];
        document.getElementById('projectTitle').textContent = project.name;
        document.getElementById('projectTeam').textContent = `Created by: ${project.team}`;
        document.getElementById('projectChallenge').textContent = project.challenge;
        document.getElementById('projectDescription').textContent = project.description;
        document.getElementById('projectLink').href = project.link;
        document.getElementById('projectCounter').textContent = `Project ${currentIndex + 1} of ${PROJECTS.length}`;

        document.getElementById('prevButton').disabled = currentIndex === 0;
        document.getElementById('nextButton').disabled = currentIndex === PROJECTS.length - 1;

        if (projectVotes[project.id].submitted) {
            Object.entries(projectVotes[project.id].ratings).forEach(([criterion, value]) => {
                const stars = document.querySelector(`[data-criterion="${criterion}"]`).children;
                Array.from(stars).forEach((star, index) => {
                    star.classList.toggle('selected', index < value);
                });
            });
            document.getElementById('projectComments').value = projectVotes[project.id].comments;
            document.querySelector('.submit-button').textContent = 'Already Voted';
            document.querySelector('.submit-button').disabled = true;
        } else {
            document.querySelectorAll('.star').forEach(star => star.classList.remove('selected'));
            document.getElementById('projectComments').value = '';
            document.querySelector('.submit-button').textContent = 'Submit Votes';
            document.querySelector('.submit-button').disabled = false;
        }

        updateTotalScore();
    }

    function navigateProject(direction) {
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < PROJECTS.length) {
            currentIndex = newIndex;
            updateProjectDisplay();
        }
    }

    function submitRating() {
        const projectId = PROJECTS[currentIndex].id;
        const comments = document.getElementById('projectComments').value;

        const ratings = projectVotes[projectId].ratings;
        const criteriaCount = document.querySelectorAll('.rating-group').length;

        if (Object.keys(ratings).length < criteriaCount) {
            alert('Please rate all criteria before submitting.');
            return;
        }

        projectVotes[projectId].comments = comments;
        projectVotes[projectId].submitted = true;

        alert('Thank you for voting!');

        if (currentIndex < PROJECTS.length - 1) {
            navigateProject(1);
        } else {
            document.querySelector('.submit-button').textContent = 'All Projects Rated';
            document.querySelector('.submit-button').disabled = true;
        }
    }

    updateProjectDisplay();
});
