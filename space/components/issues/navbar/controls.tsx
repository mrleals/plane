"use client";

import { useEffect, FC } from "react";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
// components
import { IssueFiltersDropdown } from "@/components/issues/filters";
import { NavbarIssueBoardView } from "@/components/issues/navbar/issue-board-view";
import { NavbarTheme } from "@/components/issues/navbar/theme";
import { UserAvatar } from "@/components/issues/navbar/user-avatar";
// helpers
import { queryParamGenerator } from "@/helpers/query-param-generator";
// hooks
import { useIssueFilter, useIssueDetails } from "@/hooks/store";
import useIsInIframe from "@/hooks/use-is-in-iframe";
// store
import { PublishStore } from "@/store/publish/publish.store";
// types
import { TIssueLayout } from "@/types/issue";

export type NavbarControlsProps = {
  publishSettings: PublishStore;
};

export const NavbarControls: FC<NavbarControlsProps> = observer((props) => {
  // props
  const { publishSettings } = props;
  // router
  const router = useRouter();
  const searchParams = useSearchParams();
  // query params
  const board = searchParams.get("board") || undefined;
  const labels = searchParams.get("labels") || undefined;
  const state = searchParams.get("state") || undefined;
  const priority = searchParams.get("priority") || undefined;
  const peekId = searchParams.get("peekId") || undefined;
  // hooks
  const { issueFilters, isIssueFiltersUpdated, initIssueFilters } = useIssueFilter();
  const { setPeekId } = useIssueDetails();
  // derived values
  const activeLayout = issueFilters?.display_filters?.layout || undefined;
  const { project, views, workspace_detail } = publishSettings;

  const isInIframe = useIsInIframe();

  useEffect(() => {
    if (project && workspace_detail) {
      const viewsAcceptable: string[] = [];
      let currentBoard: TIssueLayout | null = null;

      if (views?.list) viewsAcceptable.push("list");
      if (views?.kanban) viewsAcceptable.push("kanban");
      if (views?.calendar) viewsAcceptable.push("calendar");
      if (views?.gantt) viewsAcceptable.push("gantt");
      if (views?.spreadsheet) viewsAcceptable.push("spreadsheet");

      if (board) {
        if (viewsAcceptable.includes(board.toString())) currentBoard = board.toString() as TIssueLayout;
        else {
          if (viewsAcceptable && viewsAcceptable.length > 0) currentBoard = viewsAcceptable[0] as TIssueLayout;
        }
      } else {
        if (viewsAcceptable && viewsAcceptable.length > 0) currentBoard = viewsAcceptable[0] as TIssueLayout;
      }

      if (currentBoard) {
        if (activeLayout === undefined || activeLayout !== currentBoard) {
          const { query, queryParam } = queryParamGenerator({ board: currentBoard, peekId, priority, state, labels });
          const params: any = {
            display_filters: { layout: (query?.board as string[])[0] },
            filters: {
              priority: query?.priority ?? undefined,
              state: query?.state ?? undefined,
              labels: query?.labels ?? undefined,
            },
          };

          if (!isIssueFiltersUpdated(params)) {
            initIssueFilters(project, params);
            router.push(`/${workspace_detail.slug}/${project}?${queryParam}`);
          }
        }
      }
    }
  }, [
    board,
    labels,
    state,
    priority,
    peekId,
    activeLayout,
    router,
    initIssueFilters,
    setPeekId,
    isIssueFiltersUpdated,
    views,
    project,
    workspace_detail,
  ]);

  if (!workspace_detail || !project) return;

  return (
    <>
      {/* issue views */}
      <div className="relative flex flex-shrink-0 items-center gap-1 transition-all delay-150 ease-in-out">
        <NavbarIssueBoardView workspaceSlug={workspace_detail.slug} projectId={project} />
      </div>

      {/* issue filters */}
      <div className="relative flex flex-shrink-0 items-center gap-1 transition-all delay-150 ease-in-out">
        <IssueFiltersDropdown workspaceSlug={workspace_detail.slug} projectId={project} />
      </div>

      {/* theming */}
      <div className="relative flex-shrink-0">
        <NavbarTheme />
      </div>

      {!isInIframe && <UserAvatar />}
    </>
  );
});
