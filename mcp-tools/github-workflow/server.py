#!/usr/bin/env python3
"""
GitHub Workflow MCP Server
Provides tools for GitHub project management, issue tracking, and automation
"""

import asyncio
import json
import subprocess
from typing import Any, Dict, List, Optional
import sys
import os

from mcp.server import Server
from mcp.types import Resource, Tool, TextContent, ImageContent, EmbeddedResource
import mcp.server.stdio


# GitHub CLI wrapper functions
async def run_gh_command(command: List[str]) -> Dict[str, Any]:
    """Execute a GitHub CLI command and return the result"""
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )
        return {
            "success": True,
            "stdout": result.stdout,
            "stderr": result.stderr
        }
    except subprocess.CalledProcessError as e:
        return {
            "success": False,
            "stdout": e.stdout,
            "stderr": e.stderr,
            "returncode": e.returncode
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


server = Server("github-workflow")


@server.list_tools()
async def handle_list_tools() -> List[Tool]:
    """List available GitHub workflow tools"""
    return [
        Tool(
            name="create_github_issue",
            description="Create a GitHub issue with title, body, labels, and assignees",
            inputSchema={
                "type": "object",
                "properties": {
                    "repository": {"type": "string", "description": "Repository name (owner/repo format)"},
                    "title": {"type": "string", "description": "Issue title"},
                    "body": {"type": "string", "description": "Issue body/description"},
                    "labels": {"type": "array", "items": {"type": "string"}, "description": "Labels to add"},
                    "assignees": {"type": "array", "items": {"type": "string"}, "description": "Users to assign"}
                },
                "required": ["repository", "title", "body"]
            }
        ),
        Tool(
            name="link_pr_to_issue",
            description="Link a pull request to an issue",
            inputSchema={
                "type": "object",
                "properties": {
                    "repository": {"type": "string", "description": "Repository name (owner/repo format)"},
                    "pr_number": {"type": "integer", "description": "Pull request number"},
                    "issue_number": {"type": "integer", "description": "Issue number to link"}
                },
                "required": ["repository", "pr_number", "issue_number"]
            }
        ),
        Tool(
            name="list_pull_requests",
            description="List pull requests with filters",
            inputSchema={
                "type": "object",
                "properties": {
                    "repository": {"type": "string", "description": "Repository name (owner/repo format)"},
                    "state": {"type": "string", "enum": ["open", "closed", "all"], "description": "PR state filter"},
                    "labels": {"type": "array", "items": {"type": "string"}, "description": "Filter by labels"}
                },
                "required": ["repository"]
            }
        ),
        Tool(
            name="add_pr_comment",
            description="Add a comment to a pull request",
            inputSchema={
                "type": "object",
                "properties": {
                    "repository": {"type": "string", "description": "Repository name (owner/repo format)"},
                    "pr_number": {"type": "integer", "description": "Pull request number"},
                    "comment": {"type": "string", "description": "Comment text"}
                },
                "required": ["repository", "pr_number", "comment"]
            }
        ),
        Tool(
            name="create_project_board",
            description="Create a GitHub project board",
            inputSchema={
                "type": "object",
                "properties": {
                    "owner": {"type": "string", "description": "Repository owner"},
                    "title": {"type": "string", "description": "Project title"},
                    "description": {"type": "string", "description": "Project description"}
                },
                "required": ["owner", "title"]
            }
        ),
        Tool(
            name="add_issue_to_project",
            description="Add an issue to a project board",
            inputSchema={
                "type": "object",
                "properties": {
                    "project_id": {"type": "string", "description": "Project ID"},
                    "issue_url": {"type": "string", "description": "Issue URL"}
                },
                "required": ["project_id", "issue_url"]
            }
        ),
        Tool(
            name="update_issue_labels",
            description="Update labels on an issue",
            inputSchema={
                "type": "object",
                "properties": {
                    "repository": {"type": "string", "description": "Repository name (owner/repo format)"},
                    "issue_number": {"type": "integer", "description": "Issue number"},
                    "labels": {"type": "array", "items": {"type": "string"}, "description": "Labels to set"}
                },
                "required": ["repository", "issue_number", "labels"]
            }
        )
    ]


@server.call_tool()
async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
    """Handle tool calls"""
    
    if name == "create_github_issue":
        repository = arguments["repository"]
        title = arguments["title"]
        body = arguments["body"]
        labels = arguments.get("labels", [])
        assignees = arguments.get("assignees", [])
        
        # Build the gh command
        command = ["gh", "issue", "create", "--repo", repository, "--title", title, "--body", body]
        
        if labels:
            command.extend(["--label", ",".join(labels)])
        
        if assignees:
            command.extend(["--assignee", ",".join(assignees)])
        
        result = await run_gh_command(command)
        
        if result["success"]:
            return [TextContent(type="text", text=f"✅ Issue created successfully:\n{result['stdout']}")]
        else:
            return [TextContent(type="text", text=f"❌ Failed to create issue:\n{result['stderr']}")]
    
    elif name == "list_pull_requests":
        repository = arguments["repository"]
        state = arguments.get("state", "open")
        labels = arguments.get("labels", [])
        
        command = ["gh", "pr", "list", "--repo", repository, "--state", state, "--json", "number,title,labels,author"]
        
        result = await run_gh_command(command)
        
        if result["success"]:
            return [TextContent(type="text", text=f"📋 Pull requests:\n{result['stdout']}")]
        else:
            return [TextContent(type="text", text=f"❌ Failed to list PRs:\n{result['stderr']}")]
    
    elif name == "add_pr_comment":
        repository = arguments["repository"]
        pr_number = arguments["pr_number"]
        comment = arguments["comment"]
        
        command = ["gh", "pr", "comment", str(pr_number), "--repo", repository, "--body", comment]
        
        result = await run_gh_command(command)
        
        if result["success"]:
            return [TextContent(type="text", text=f"✅ Comment added successfully:\n{result['stdout']}")]
        else:
            return [TextContent(type="text", text=f"❌ Failed to add comment:\n{result['stderr']}")]
    
    elif name == "link_pr_to_issue":
        repository = arguments["repository"]
        pr_number = arguments["pr_number"]
        issue_number = arguments["issue_number"]
        
        # Add a label to link PR and issue
        label = f"linked-pr-{pr_number}"
        command = ["gh", "issue", "edit", str(issue_number), "--repo", repository, "--add-label", label]
        
        result = await run_gh_command(command)
        
        if result["success"]:
            return [TextContent(type="text", text=f"✅ Linked PR #{pr_number} to issue #{issue_number}")]
        else:
            return [TextContent(type="text", text=f"❌ Failed to link PR to issue:\n{result['stderr']}")]
    
    elif name == "create_project_board":
        owner = arguments["owner"]
        title = arguments["title"]
        description = arguments.get("description", "")
        
        command = ["gh", "project", "create", "--owner", owner, "--title", title]
        
        result = await run_gh_command(command)
        
        if result["success"]:
            return [TextContent(type="text", text=f"✅ Project created successfully:\n{result['stdout']}")]
        else:
            return [TextContent(type="text", text=f"❌ Failed to create project:\n{result['stderr']}")]
    
    elif name == "add_issue_to_project":
        project_id = arguments["project_id"]
        issue_url = arguments["issue_url"]
        
        command = ["gh", "project", "item-add", project_id, "--url", issue_url]
        
        result = await run_gh_command(command)
        
        if result["success"]:
            return [TextContent(type="text", text=f"✅ Issue added to project successfully")]
        else:
            return [TextContent(type="text", text=f"❌ Failed to add issue to project:\n{result['stderr']}")]
    
    elif name == "update_issue_labels":
        repository = arguments["repository"]
        issue_number = arguments["issue_number"]
        labels = arguments["labels"]
        
        command = ["gh", "issue", "edit", str(issue_number), "--repo", repository]
        if labels:
            command.extend(["--add-label", ",".join(labels)])
        
        result = await run_gh_command(command)
        
        if result["success"]:
            return [TextContent(type="text", text=f"✅ Labels updated successfully")]
        else:
            return [TextContent(type="text", text=f"❌ Failed to update labels:\n{result['stderr']}")]
    
    else:
        return [TextContent(type="text", text=f"❌ Unknown tool: {name}")]


async def main():
    """Main entry point"""
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )


if __name__ == "__main__":
    asyncio.run(main())