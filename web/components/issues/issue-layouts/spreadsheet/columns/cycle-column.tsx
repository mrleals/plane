import React, { useCallback } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
// types
import { TIssue } from "@plane/types";
// components
import { CycleDropdown } from "@/components/dropdowns";
// constants
import { EIssuesStoreType } from "@/constants/issue";
// helpers
import { cn } from "@/helpers/common.helper";
// hooks
import { useEventTracker, useIssues } from "@/hooks/store";

type Props = {
  issue: TIssue;
  onClose: () => void;
  disabled: boolean;
  isIssueSelected: boolean;
};

export const SpreadsheetCycleColumn: React.FC<Props> = observer((props) => {
  const { issue, disabled, onClose, isIssueSelected } = props;
  // router
  const router = useRouter();
  const { workspaceSlug } = router.query;
  // hooks
  const { captureIssueEvent } = useEventTracker();
  const {
    issues: { addCycleToIssue, removeCycleFromIssue },
  } = useIssues(EIssuesStoreType.CYCLE);

  const handleCycle = useCallback(
    async (cycleId: string | null) => {
      if (!workspaceSlug || !issue || issue.cycle_id === cycleId) return;
      if (cycleId) await addCycleToIssue(workspaceSlug.toString(), issue.project_id, cycleId, issue.id);
      else await removeCycleFromIssue(workspaceSlug.toString(), issue.project_id, issue.id);
      captureIssueEvent({
        eventName: "Issue updated",
        payload: {
          ...issue,
          cycle_id: cycleId,
          element: "Spreadsheet layout",
        },
        updates: { changed_property: "cycle", change_details: { cycle_id: cycleId } },
        path: router.asPath,
      });
    },
    [workspaceSlug, issue, addCycleToIssue, removeCycleFromIssue, captureIssueEvent, router.asPath]
  );

  return (
    <div className="h-11 border-b-[0.5px] border-custom-border-200">
      <CycleDropdown
        projectId={issue.project_id}
        value={issue.cycle_id}
        onChange={handleCycle}
        disabled={disabled}
        placeholder="Select cycle"
        buttonVariant="transparent-with-text"
        buttonContainerClassName={cn("w-full relative flex items-center p-2", {
          "bg-custom-primary-100/5 hover:bg-custom-primary-100/10": isIssueSelected,
        })}
        buttonClassName="relative leading-4 h-4.5 bg-transparent"
        onClose={onClose}
      />
    </div>
  );
});
