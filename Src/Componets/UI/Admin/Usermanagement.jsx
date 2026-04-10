import { useState, useEffect } from "react"
// import { base44 } from "@/api/base44Client"
import { Button } from "@/components/ui/button"
import StatusBadge from "../../StatusBadge"
import { Check, X, Loader2, AlertCircle, RefreshCw } from "lucide-react"

export default function UserManagement() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [error, setError] = useState(null)

  const loadRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      // const data = await base44.entities.SignupRequest.list("-created_date", 100)
      setRequests(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || "Failed to load requests")
      // Load requests error (silently handled)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const handleAction = async (id, status) => {
    setUpdating(id)
    try {
      // await base44.entities.SignupRequest.update(id, { status })
      setRequests(prev =>
        prev.map(req => req.id === id ? { ...req, status } : req)
      )
    } catch (err) {
      setError(`Failed to ${status.toLowerCase()} request: ${err.message}`)
      // Handle action error (silently handled)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">Loading signup requests...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 bg-loss/10 border border-loss/30 rounded-lg mb-6">
        <AlertCircle className="h-5 w-5 text-loss flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-loss">Error</p>
          <p className="text-sm text-loss/80">{error}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={loadRequests}
          className="text-loss hover:bg-loss/10"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-surface2/30 rounded-lg border border-border/30">
        <p className="text-sm text-muted-foreground mb-2">No signup requests yet.</p>
        <p className="text-xs text-muted-foreground/60">
          New requests will appear here as they come in.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface2 border-b border-border/50">
              <th className="text-left px-4 py-3 font-mono text-[11px] text-muted-foreground font-semibold">
                NAME
              </th>
              <th className="text-left px-4 py-3 font-mono text-[11px] text-muted-foreground font-semibold">
                USERNAME
              </th>
              <th className="text-left px-4 py-3 font-mono text-[11px] text-muted-foreground font-semibold">
                EMAIL
              </th>
              <th className="text-left px-4 py-3 font-mono text-[11px] text-muted-foreground font-semibold">
                STATUS
              </th>
              <th className="text-left px-4 py-3 font-mono text-[11px] text-muted-foreground font-semibold">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req.id}
                className="border-b border-border/30 hover:bg-surface-offset/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium">
                  {req.first_name} {req.last_name}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                  {req.username}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {req.email}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-4 py-3">
                  {req.status === "Pending" && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-win hover:bg-win/10"
                        onClick={() => handleAction(req.id, "Approved")}
                        disabled={updating === req.id}
                        title="Approve"
                      >
                        {updating === req.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-loss hover:bg-loss/10"
                        onClick={() => handleAction(req.id, "Denied")}
                        disabled={updating === req.id}
                        title="Deny"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {req.status !== "Pending" && (
                    <span className="text-xs text-muted-foreground">
                      {req.status === "Approved" ? "✓" : "✗"} {req.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 text-xs">
        <div className="bg-active/5 border border-active/20 rounded-lg p-3 text-center">
          <p className="text-muted-foreground mb-1">Pending</p>
          <p className="font-bold text-active">
            {requests.filter(r => r.status === "Pending").length}
          </p>
        </div>
        <div className="bg-win/5 border border-win/20 rounded-lg p-3 text-center">
          <p className="text-muted-foreground mb-1">Approved</p>
          <p className="font-bold text-win">
            {requests.filter(r => r.status === "Approved").length}
          </p>
        </div>
        <div className="bg-loss/5 border border-loss/20 rounded-lg p-3 text-center">
          <p className="text-muted-foreground mb-1">Denied</p>
          <p className="font-bold text-loss">
            {requests.filter(r => r.status === "Denied").length}
          </p>
        </div>
      </div>
    </div>
  )
}
