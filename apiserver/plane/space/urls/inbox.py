from django.urls import path


from plane.space.views import (
    InboxIssuePublicViewSet,
    IssueVotePublicViewSet,
    WorkspaceProjectDeployBoardEndpoint,
)


urlpatterns = [
    path(
        "anchor/<uuid:anchor_id>/inboxes/<uuid:inbox_id>/inbox-issues/",
        InboxIssuePublicViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
        name="inbox-issue",
    ),
    path(
        "anchor/<uuid:anchor_id>/inboxes/<uuid:inbox_id>/inbox-issues/<uuid:pk>/",
        InboxIssuePublicViewSet.as_view(
            {
                "get": "retrieve",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="inbox-issue",
    ),
    path(
        "anchor/<uuid:anchor_id>/issues/<uuid:issue_id>/votes/",
        IssueVotePublicViewSet.as_view(
            {
                "get": "list",
                "post": "create",
                "delete": "destroy",
            }
        ),
        name="issue-vote-project-board",
    ),
    path(
        "workspaces/<str:slug>/project-boards/",
        WorkspaceProjectDeployBoardEndpoint.as_view(),
        name="workspace-project-boards",
    ),
]
