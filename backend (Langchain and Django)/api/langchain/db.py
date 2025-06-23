from langchain_pinecone import PineconeVectorStore
from openai import vector_stores
from pinecone import Pinecone
import os

os.environ["PINECONE_API_KEY"] = (
    "pcsk_6JLk9t_PANwkAZxWTq36FKFwYUmphy5F1XRYcTUTskjj5nbqPwoSUnH9n35Rk4gofE8C7Y"
)

pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])

EMBEDDING_DIM = 384


def get_db(embedding, index_name):
    vector_store = PineconeVectorStore.from_existing_index(
        embedding=embedding, index_name=index_name
    )
    return vector_store
