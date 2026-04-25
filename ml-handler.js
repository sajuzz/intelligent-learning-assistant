import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

class MLHandler {
    constructor() {
        this.classifier = null;
        this.isReady = false;
        this.labels = ['confused', 'understands', 'bored', 'excited', 'ready to move on', 'needs examples'];
    }

    async init(onProgress) {
        try {
            console.log('Initializing Transformers.js...');
            // Load the zero-shot classification pipeline
            this.classifier = await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli', {
                dtype: 'q4',
                progress_callback: (data) => {
                    if (onProgress && data.status === 'progress') {
                        onProgress(data.progress);
                    }
                }
            });
            this.isReady = true;
            console.log('ML Handler Ready');
            return true;
        } catch (error) {
            console.error('Failed to initialize ML Handler:', error);
            return false;
        }
    }

    async analyzeFeedback(text) {
        if (!this.isReady) return null;

        try {
            const output = await this.classifier(text, this.labels);
            // Return the top prediction
            return {
                label: output.labels[0],
                score: output.scores[0]
            };
        } catch (error) {
            console.error('Analysis failed:', error);
            return null;
        }
    }
}

export const mlHandler = new MLHandler();
