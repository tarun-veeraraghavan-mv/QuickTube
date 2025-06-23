🧠 AI YouTube Video Summarizer
A full-stack RAG-based AI web application that allows users to ask questions about any YouTube video and receive real-time, accurate summaries and responses powered by LLMs. The app leverages OpenAI’s Whisper for transcription, LangChain for chunking and retrieval, Pinecone for vector storage, and DeepSeek/GPT-4 for answer generation. Built with a modern Next.js frontend and a Django REST backend.

🚀 Features
✅ Ask Questions on Any YouTube Video — Automatically transcribes and summarizes content using advanced LLMs
📺 Transcript Extraction via YouTube API and Whisper — Supports videos with and without captions
🔍 RAG Pipeline — Embeds transcript chunks and performs semantic retrieval via Pinecone
🔐 User Auth & History — Secure \textbf{JWT-based} login with persistent chat and video summary history
📥 Download Transcripts — Store and access full transcripts using secure AWS S3 integration
⚡ Real-Time Responses — LLM answers streamed back to frontend for a fast UX
🎨 Clean, Responsive UI — Built with Next.js, Tailwind CSS, and TypeScript
🛠️ Production-Ready API — Django REST Framework with modular MVC architecture

🧠 LLM + RAG Pipeline Overview
The summarization and Q&A engine combines the best of Retrieval-Augmented Generation with LLMs to return highly contextual answers:

Transcript Retrieval: Extracted via YouTube API or Whisper ASR

Chunking & Embedding: Processed using LangChain, embedded via OpenAI or DeepSeek

Storage & Retrieval: Chunks stored in Pinecone Vector DB, queried based on semantic similarity

LLM Response Generation: Relevant chunks passed into DeepSeek/GPT-4 to generate precise summaries or answers

Transcript Archival: Full video transcript uploaded to AWS S3 for optional user download

🖥️ Tech Stack
Frontend	Backend	LLM / RAG	Storage & Infra	Auth
Next.js (React)	Django REST Framework	LangChain, DeepSeek, Whisper	Pinecone, AWS S3	JWT
TypeScript	Django Class-Based Views	OpenAI GPT-4	PostgreSQL (Optional)	DRF SimpleJWT
Tailwind CSS	Django ORM	Sentence Transformers (Optional)	AWS S3	

📷 Preview
🎥 Coming soon: Live demo walkthrough + deployment link
📎 Screenshots and video previews will be added after production polish

📂 Data & Model Sources
🎙️ YouTube Transcripts — Via official API and Whisper for fallback ASR

🔎 Embeddings — Generated using OpenAI's text-embedding-3-small or DeepSeek's embedding model

🧠 Answer Engine — Powered by GPT-4 or DeepSeek LLM with context injection

🔗 Relevant Links
🔧 Source Code (GitHub)

🌐 Live Demo (Replace with real link)
