import { mlHandler } from './ml-handler.js';

class App {
    constructor() {
        this.content = null;
        this.currentTopicIndex = 0;
        this.currentLevel = 'beginner'; // beginner, intermediate, advanced
        this.userProgress = 5;
        this.isMlReady = false;

        this.elements = {
            learningContainer: document.getElementById('learning-container'),
            statusIndicator: document.getElementById('ml-status'),
            statusText: document.querySelector('#ml-status .text'),
            startBtn: document.getElementById('start-btn'),
            feedbackArea: document.getElementById('feedback-area'),
            actionArea: document.getElementById('action-area'),
            userInput: document.getElementById('user-input'),
            sendBtn: document.getElementById('send-btn'),
            progressBar: document.getElementById('overall-progress'),
            userLevelText: document.getElementById('user-level'),
            currentTopicTitle: document.getElementById('current-topic')
        };

        this.init();
    }

    async init() {
        try {
            // Local fallback content to prevent CORS issues with file://
            this.content = {
                "topics": [
                    {
                        "id": "intro",
                        "title": "Welcome to Neural Networks",
                        "levels": {
                            "beginner": {
                                "content": "Think of a Neural Network as a digital brain. Just like your brain has neurons connected to each other, a computer has artificial neurons that pass signals. They learn by looking at thousands of examples, like seeing many photos of cats until they know what a cat looks like.",
                                "quiz": {
                                    "question": "What is the primary way a Neural Network learns?",
                                    "options": ["By following a fixed list of rules", "By looking at many examples", "By manual programming for every cat"],
                                    "answer": 1
                                }
                            },
                            "intermediate": {
                                "content": "A Neural Network consists of layers: Input, Hidden, and Output. Signals pass through connections with 'weights' that determine how important a signal is. Learning involves adjusting these weights to minimize errors using a process called Backpropagation.",
                                "quiz": {
                                    "question": "What component determines the strength of a signal between neurons?",
                                    "options": ["The Layer ID", "The Neuron Name", "The Weights"],
                                    "answer": 2
                                }
                            },
                            "advanced": {
                                "content": "Deep Neural Networks leverage non-linear activation functions (like ReLU or Sigmoid) to model complex patterns. They optimize a cost function using Gradient Descent, where the 'learning rate' controls the step size towards the global minimum of the error surface.",
                                "quiz": {
                                    "question": "What role do non-linear activation functions play?",
                                    "options": ["They speed up the computer", "They allow the model to learn complex, non-straight patterns", "They delete incorrect neurons"],
                                    "answer": 1
                                }
                            }
                        }
                    },
                    {
                        "id": "concepts",
                        "title": "Core Architectures",
                        "levels": {
                            "beginner": {
                                "content": "Not all neural networks are the same! Some are great at 'seeing' (CNNs), while others are great at 'listening' or 'reading' (RNNs). It's like having different specialists for different jobs.",
                                "quiz": {
                                    "question": "Which type of network is usually best for analyzing images?",
                                    "options": ["CNN (Convolutional)", "RNN (Recurrent)", "Simple Spreadsheet"],
                                    "answer": 0
                                }
                            }
                        }
                    }
                ]
            };

            // Attempt to fetch fresh content if on a server
            if (window.location.protocol !== 'file:') {
                try {
                    const response = await fetch('./content.json');
                    if (response.ok) {
                        this.content = await response.json();
                    }
                } catch (e) {
                    console.warn("Could not fetch content.json, using embedded content.");
                }
            }

            // Remove loading spinner
            this.elements.learningContainer.innerHTML = '';
            
            // Initialize ML in background (doesn't block UI)
            this.initML();

            // Event Listeners
            this.elements.startBtn.addEventListener('click', () => this.startLearning());
            this.elements.sendBtn.addEventListener('click', () => this.handleFeedback());
            this.elements.userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleFeedback();
            });
        } catch (error) {
            console.error("App initialization failed:", error);
            this.elements.learningContainer.innerHTML = '<div class="error-msg">Something went wrong. Please refresh the page.</div>';
        }
    }

    async initML() {
        const success = await mlHandler.init((progress) => {
            this.elements.statusText.textContent = `Downloading AI: ${Math.round(progress)}%`;
        });
        if (success) {
            this.isMlReady = true;
            this.elements.statusIndicator.classList.remove('loading');
            this.elements.statusIndicator.classList.add('ready');
            this.elements.statusText.textContent = 'AI Assistant Ready';
        } else {
            this.elements.statusText.textContent = 'AI Offline (Rules Only)';
        }
    }

    startLearning() {
        this.elements.actionArea.classList.add('hidden');
        this.elements.feedbackArea.classList.remove('hidden');
        this.renderCurrentModule();
    }

    renderCurrentModule() {
        const topic = this.content.topics[this.currentTopicIndex];
        const module = topic.levels[this.currentLevel];

        this.elements.currentTopicTitle.textContent = topic.title;
        
        let html = `
            <div class="card">
                <h2>${topic.title} - ${this.currentLevel.charAt(0).toUpperCase() + this.currentLevel.slice(1)}</h2>
                <p>${module.content}</p>
                <div class="quiz-section">
                    <p><strong>Quick Check:</strong> ${module.quiz.question}</p>
                    <div class="options">
                        ${module.quiz.options.map((opt, i) => `
                            <button class="quiz-option" data-index="${i}">${opt}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.elements.learningContainer.innerHTML = html;

        // Add quiz listeners
        const options = this.elements.learningContainer.querySelectorAll('.quiz-option');
        options.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuiz(e, module.quiz.answer));
        });

        this.updateProgress();
    }

    handleQuiz(e, correctIndex) {
        const selectedIndex = parseInt(e.target.dataset.index);
        const options = this.elements.learningContainer.querySelectorAll('.quiz-option');
        
        options.forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');

        if (selectedIndex === correctIndex) {
            this.addMessage("Correct! You're picking this up quickly.", 'success');
            // If they are correct, we might level them up next time
        } else {
            this.addMessage("Not quite. Let's look at that again or try a simpler explanation.", 'warning');
            // If they are wrong, we might stay at beginner or give more examples
            this.currentLevel = 'beginner'; 
        }
    }

    addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `status-msg ${type}`;
        msg.textContent = text;
        msg.style.marginTop = '1rem';
        msg.style.fontWeight = '600';
        msg.style.color = type === 'success' ? '#00e676' : '#ffab40';
        this.elements.learningContainer.querySelector('.card').appendChild(msg);
    }

    async handleFeedback() {
        const text = this.elements.userInput.value.trim();
        if (!text) return;

        this.elements.userInput.value = '';
        this.elements.userInput.placeholder = "Analyzing your feedback...";
        this.elements.userInput.disabled = true;

        let adaptation = "neutral";
        
        if (this.isMlReady) {
            const analysis = await mlHandler.analyzeFeedback(text);
            console.log("Feedback Analysis:", analysis);
            adaptation = this.processMLAnalysis(analysis);
        } else {
            // Fallback to simple keyword rules
            adaptation = this.processRuleAnalysis(text);
        }

        this.adaptContent(adaptation);
        this.elements.userInput.disabled = false;
        this.elements.userInput.placeholder = "Type your thoughts...";
    }

    processMLAnalysis(analysis) {
        const label = analysis.label;
        if (label === 'confused' || label === 'needs examples') return 'simplify';
        if (label === 'ready to move on' || label === 'understands' || label === 'excited') return 'advance';
        if (label === 'bored') return 'jump';
        return 'continue';
    }

    processRuleAnalysis(text) {
        const lower = text.toLowerCase();
        if (lower.includes('hard') || lower.includes('confused') || lower.includes('don\'t understand')) return 'simplify';
        if (lower.includes('easy') || lower.includes('next') || lower.includes('ready')) return 'advance';
        return 'continue';
    }

    adaptContent(action) {
        const levels = ['beginner', 'intermediate', 'advanced'];
        let levelIdx = levels.indexOf(this.currentLevel);

        if (action === 'advance') {
            if (levelIdx < 2) {
                this.currentLevel = levels[levelIdx + 1];
                this.addMessage("Great confidence! Moving to " + this.currentLevel + " content.", 'success');
            } else {
                this.currentTopicIndex++;
                this.currentLevel = 'beginner';
                this.addMessage("Topic mastered! Moving to next section.", 'success');
            }
        } else if (action === 'simplify') {
            if (levelIdx > 0) {
                this.currentLevel = levels[levelIdx - 1];
                this.addMessage("No problem, let's take it a bit slower.", 'warning');
            } else {
                this.addMessage("I'll try to provide more examples for this level.", 'warning');
            }
        }

        setTimeout(() => this.renderCurrentModule(), 2000);
    }

    updateProgress() {
        const totalTopics = this.content.topics.length;
        const progress = ((this.currentTopicIndex / totalTopics) * 100) + (this.currentLevel === 'intermediate' ? 10 : this.currentLevel === 'advanced' ? 20 : 0);
        this.elements.progressBar.style.width = `${Math.min(progress, 100)}%`;
        this.elements.userLevelText.textContent = this.currentLevel;

        // Update nav items
        const navIds = ['nav-intro', 'nav-concepts', 'nav-application', 'nav-assessment'];
        navIds.forEach((id, idx) => {
            const el = document.getElementById(id);
            if (idx === this.currentTopicIndex) {
                el.classList.add('active');
                el.classList.remove('locked');
            } else if (idx < this.currentTopicIndex) {
                el.classList.remove('active', 'locked');
                el.style.color = 'var(--success)';
            }
        });
    }
}

// Start the app
window.addEventListener('DOMContentLoaded', () => {
    new App();
});
