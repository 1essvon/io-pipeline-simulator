
import { useState } from "react";
import type { DiskRequest } from "../../algorithms/types";

interface RequestListEditorProps {
  requests: DiskRequest[];
  minCylinder: number;
  maxCylinder: number;
  onChange: (requests: DiskRequest[]) => void;
}

function createNextId(requests: DiskRequest[]): string {
  const numbers = requests
    .map((request) => Number(request.id.replace(/^R/, "")))
    .filter((value) => Number.isFinite(value));

  const highest = numbers.length > 0 ? Math.max(...numbers) : 0;
  return `R${highest + 1}`;
}

export function RequestListEditor({
  requests,
  minCylinder,
  maxCylinder,
  onChange,
}: RequestListEditorProps) {
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");

  function handleAdd() {
    const value = draft.trim();

    if (!/^\d+$/.test(value)) {
      setMessage("Masukkan cylinder berupa bilangan bulat yang valid.");
      return;
    }

    const cylinder = Number(value);

    if (!Number.isSafeInteger(cylinder)) {
      setMessage("Nilai cylinder tidak valid.");
      return;
    }

    if (cylinder < minCylinder || cylinder > maxCylinder) {
      setMessage(
        `Cylinder harus berada dalam rentang ${minCylinder}–${maxCylinder}.`,
      );
      return;
    }

    onChange([
      ...requests,
      {
        id: createNextId(requests),
        cylinder,
        arrivalTime: 0,
      },
    ]);

    setDraft("");
    setMessage("");
  }

  function handleRemove(id: string) {
    onChange(requests.filter((request) => request.id !== id));
    setMessage("");
  }

  return (
    <div className="request-editor">
      <span className="field-label">Permintaan (Cylinder)</span>

      <div className="request-chips">
        {requests.length === 0 && (
          <span className="metrics-empty">Belum ada permintaan.</span>
        )}

        {requests.map((request) => (
          <span className="request-chip" key={request.id}>
            {request.cylinder}
            <button
              type="button"
              aria-label={`Hapus request ${request.id}`}
              onClick={() => handleRemove(request.id)}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="request-add">
        <input
          type="text"
          inputMode="numeric"
          value={draft}
          placeholder="Nomor cylinder"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleAdd();
          }}
        />

        <button type="button" onClick={handleAdd}>
          + Tambah
        </button>
      </div>

      {message && <p className="field-error">{message}</p>}
    </div>
  );
}
