import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
from groq import Groq
from flask_cors import CORS  # Import CORS

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for the entire app
CORS(app)  # This will allow all domains to access the app

# Alternatively, if you want to restrict to a specific domain (e.g., 'http://localhost:3000' for React app)
# CORS(app, origins=["http://localhost:3000"])

# Load API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in environment variables.")

# Groq client and LLM setup
client = Groq(api_key=GROQ_API_KEY)
llm = ChatGroq(model_name="llama3-70b-8192")

# Create 'data' folder if not exists
if not os.path.exists("data"):
    os.makedirs("data")

# Global variables to hold embeddings and retrievers
db = None
retriever = None

@app.route("/")
def home():
    """
    Root endpoint to provide a friendly welcome message.
    """
    return jsonify({
        "message": "Welcome to the Chat with Documents API! Use /upload to upload documents and /ask to ask questions."
    }), 200

@app.route("/upload", methods=["POST"])
def upload_document():
    """
    Upload and process the document.
    """
    global db, retriever

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "No file selected"}), 400

    # Save file to data directory
    filepath = os.path.join("data", file.filename)
    file.save(filepath)

    try:
        # Load document
        loader = PyPDFLoader(filepath)
        data = loader.load()

        # Split document into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=100
        )
        text = text_splitter.split_documents(data)

        # Embed the text
        embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
        db = FAISS.from_documents(text, embeddings)
        retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 4})

        return jsonify({"message": f"Document '{file.filename}' processed successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/ask", methods=["POST"])
def ask_question():
    """
    Answer questions based on the uploaded document.
    """
    global retriever
    if retriever is None:
        return jsonify({"error": "No document uploaded or processed yet"}), 400

    data = request.json
    question = data.get("question")
    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        # Create prompt template
        prompt_template = '''
        You are a helpful assistant. Greet the user before answering.

        {context}
        {question}
        '''
        prompt = PromptTemplate(
            template=prompt_template, input_variables=["context", "question"]
        )

        # Create QA chain
        qa = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": prompt},
        )

        # Get the result
        result = qa(question)
        return jsonify({"answer": result["result"]}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    from waitress import serve
    print("Running Flask app with Waitress on port 5000... Access it at http://127.0.0.1:5000")
    serve(app, host="127.0.0.1", port=5000)
