# from typing import Optional, TypedDict, Annotated
# from fastapi import APIRouter, Query, Depends
# from fastapi.responses import StreamingResponse
# from sqlalchemy.orm import Session
# from uuid import uuid4
# import json
# from dotenv import load_dotenv

# from app.config.db import get_db
# from app.models.auth import User
# from app.models.chatMessage import ChatMessage
# from app.models.chatSession import ChatSession
# from app.dependencies.dependencies import get_current_user

# from langgraph.graph import add_messages, StateGraph, END
# from langgraph.checkpoint.memory import MemorySaver
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_core.messages import HumanMessage, AIMessageChunk, ToolMessage
# from langchain_tavily import TavilySearch

# load_dotenv()

# # ----------------------------
# # Memory and Graph Setup
# # ----------------------------
# memory = MemorySaver()

# class State(TypedDict):
#     messages: Annotated[list, add_messages]

# # Tools
# search_tool = TavilySearch(max_results=4)
# tools = [search_tool]

# # LLM
# llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
# llm_with_tools = llm.bind_tools(tools=tools)

# # ----------------------------
# # LLM Node
# # ----------------------------
# async def model_node(state: State):
#     result = await llm_with_tools.ainvoke(state["messages"])
#     return {"messages": [result]}

# # ----------------------------
# # Tool Node
# # ----------------------------
# async def tool_node(state: State):
#     tool_calls = getattr(state["messages"][-1], "tool_calls", [])
#     tool_messages = []

#     for call in tool_calls:
#         tool_name = call["name"]
#         tool_args = call["args"]
#         tool_id = call["id"]

#         if tool_name == "tavily_search_results_json":
#             search_results = await search_tool.ainvoke(tool_args)
#             tool_messages.append(ToolMessage(
#                 content=str(search_results),
#                 tool_call_id=tool_id,
#                 name=tool_name
#             ))

#     return {"messages": tool_messages}

# # ----------------------------
# # Conditional Routing
# # ----------------------------
# async def tools_router(state: State):
#     last_msg = state["messages"][-1]
#     if hasattr(last_msg, "tool_calls") and len(last_msg.tool_calls) > 0:
#         return "tool_node"
#     return END

# # ----------------------------
# # Build Graph
# # ----------------------------
# graph_builder = StateGraph(State)
# graph_builder.add_node("model", model_node)
# graph_builder.add_node("tool_node", tool_node)
# graph_builder.set_entry_point("model")
# graph_builder.add_conditional_edges("model", tools_router)
# graph_builder.add_edge("tool_node", "model")
# graph = graph_builder.compile(checkpointer=memory)

# # ----------------------------
# # FastAPI App
# # ----------------------------
# router = APIRouter()
# app = router
# # ----------------------------
# # Helpers
# # ----------------------------
# def serialize_ai_chunk(chunk):
#     if isinstance(chunk, AIMessageChunk):
#         return chunk.content
#     raise TypeError(f"Cannot serialize object of type {type(chunk).__name__}")

# # ----------------------------
# # Streaming Chat with DB
# # ----------------------------
# async def generate_chat_stream(
#     db: Session,
#     user: User,
#     message: str,
#     session_id: Optional[str] = None
# ):
#     # 1️⃣ Get or create session
#     if session_id:
#         session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == user.id).first()
#         if not session:
#             raise ValueError("Session not found")
#     else:
#         session = ChatSession(
#             id=str(uuid4()),
#             title="New Chat",
#             user_id=user.id
#         )
#         db.add(session)
#         db.commit()
#         db.refresh(session)

#     # 2️⃣ Save user message
#     user_msg = ChatMessage(
#         session_id=session.id,
#         role="user",
#         content=message
#     )
#     db.add(user_msg)
#     db.commit()
#     db.refresh(user_msg)

#     # 3️⃣ Start LangGraph stream
#     events = graph.astream_events({"messages": [HumanMessage(content=message)]}, version="v2",
#                                   config={"configurable": {"thread_id": session.id}})

#     # Send session_id first
#     yield f"data: {json.dumps({'type': 'session', 'session_id': session.id})}\n\n"

#     ai_content_accum = ""

#     async for event in events:
#         evt_type = event["event"]

#         if evt_type == "on_chat_model_stream":
#             chunk_content = serialize_ai_chunk(event["data"]["chunk"])
#             ai_content_accum += chunk_content
#             yield f"data: {json.dumps({'type': 'content', 'content': chunk_content})}\n\n"

#         elif evt_type == "on_chat_model_end":
#             # Save AI message after stream ends
#             ai_msg = ChatMessage(
#                 session_id=session.id,
#                 role="assistant",
#                 content=ai_content_accum
#             )
#             db.add(ai_msg)
#             db.commit()
#             db.refresh(ai_msg)

#             # Check for tool calls
#             tool_calls = getattr(event["data"]["output"], "tool_calls", [])
#             for call in tool_calls:
#                 if call["name"] == "tavily_search_results_json":
#                     query = call["args"].get("query", "")
#                     yield f"data: {json.dumps({'type': 'search_start', 'query': query})}\n\n"

#         elif evt_type == "on_tool_end" and event.get("name") == "tavily_search_results_json":
#             output = event["data"]["output"]
#             urls = [item["url"] for item in output if isinstance(item, dict) and "url" in item]
#             yield f"data: {json.dumps({'type': 'search_results', 'urls': urls})}\n\n"

#     yield f"data: {json.dumps({'type': 'end'})}\n\n"

# # ----------------------------
# # FastAPI Route
# # ----------------------------
# @app.get("/chat_stream")
# async def chat_stream(
#     message: str = Query(...),
#     session_id: Optional[str] = Query(None),
#     db: Session = Depends(get_db),
#     user: User = Depends(get_current_user)
# ):
#     return StreamingResponse(
#         generate_chat_stream(db, user, message, session_id),
#         media_type="text/event-stream"
#     )









from typing import Optional, TypedDict, Annotated
from fastapi import APIRouter, Query, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from uuid import uuid4
import json
from dotenv import load_dotenv

from app.config.db import get_db
from app.models.auth import User
from app.models.chatMessage import ChatMessage
from app.models.chatSession import ChatSession
from app.dependencies.dependencies import get_current_user

from langgraph.graph import add_messages, StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessageChunk, ToolMessage
from langchain_tavily import TavilySearch

load_dotenv()

# ----------------------------
# Memory and Graph Setup
# ----------------------------
memory = MemorySaver()

class State(TypedDict):
    messages: Annotated[list, add_messages]

# ----------------------------
# Helper Functions
# ----------------------------
def serialize_ai_chunk(chunk):
    if isinstance(chunk, AIMessageChunk):
        return chunk.content
    raise TypeError(f"Cannot serialize object of type {type(chunk).__name__}")

# ----------------------------
# Chat Generation Function
# ----------------------------
async def generate_chat_stream(
    db: Session,
    user: User,
    message: str,
    session_id: Optional[str] = None
):
    # 1️⃣ Get or create session
    if session_id:
        session = db.query(ChatSession).filter(ChatSession.id == session_id, ChatSession.user_id == user.id).first()
        if not session:
            raise ValueError("Session not found")
        # Load all previous messages
        previous_messages = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).order_by(ChatMessage.created_at).all()
    else:
        session = ChatSession(
            id=str(uuid4()),
            title=message[:100],  # first user message as title
            user_id=user.id
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        previous_messages = []

    # 2️⃣ Save user message
    user_msg = ChatMessage(
        session_id=session.id,
        role="user",
        content=f"**User:** {message}"
    )
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    # 3️⃣ Prepare messages for LLM
    llm_messages = []
    for msg in previous_messages:
        if msg.role == "user":
            llm_messages.append(HumanMessage(content=msg.content))
        elif msg.role == "assistant":
            llm_messages.append(AIMessageChunk(content=msg.content))
    llm_messages.append(HumanMessage(content=user_msg.content))  # include current message

    # 4️⃣ Decide LLM / tools based on user input
    if "search" in message.lower():
        # Use LLM with TavilySearch
        search_tool = TavilySearch(max_results=4)
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
        llm_with_tools = llm.bind_tools(tools=[search_tool])
    else:
        # Use plain LLM without tools
        llm_with_tools = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

    # 5️⃣ Build temporary LangGraph for this request
    async def model_node(state: State):
        result = await llm_with_tools.ainvoke(state["messages"])
        return {"messages": [result]}

    graph_builder = StateGraph(State)
    graph_builder.add_node("model", model_node)
    graph_builder.set_entry_point("model")
    graph = graph_builder.compile(checkpointer=memory)

    # 6️⃣ Start streaming
    events = graph.astream_events({"messages": llm_messages}, version="v2",
                                  config={"configurable": {"thread_id": session.id}})

    # Send session_id first
    yield f"data: {json.dumps({'type': 'session', 'session_id': session.id})}\n\n"

    ai_content_accum = ""

    async for event in events:
        evt_type = event["event"]

        if evt_type == "on_chat_model_stream":
            chunk_content = serialize_ai_chunk(event["data"]["chunk"])
            ai_content_accum += chunk_content
            yield f"data: {json.dumps({'type': 'content', 'content': f'**AI:** {chunk_content}'})}\n\n"

        elif evt_type == "on_chat_model_end":
            # Save AI message
            ai_msg = ChatMessage(
                session_id=session.id,
                role="assistant",
                content=f"**AI:** {ai_content_accum}"
            )
            db.add(ai_msg)
            db.commit()
            db.refresh(ai_msg)

    yield f"data: {json.dumps({'type': 'end'})}\n\n"

# ----------------------------
# FastAPI Route
# ----------------------------
router = APIRouter()

@router.get("/chat_stream")
async def chat_stream(
    message: str = Query(...),
    session_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return StreamingResponse(
        generate_chat_stream(db, user, message, session_id),
        media_type="text/event-stream"
    )
