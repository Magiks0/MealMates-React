import React, { useState } from "react";
import { Bookmark, BookmarkPlus } from "lucide-react";
import {
  listSavedSearches,
  saveSearch,
  deleteSavedSearch,
} from "../../services/SavedSearchService";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { buildSearchParams } from "../../utils/cleanParams";
export default function SavedSearches({
  filters,
  setFilters,
  searchText,
  setSearchText,
  savedSearches,
  fetchSavedSearches,
  showSavedList,
  setShowSavedList,
  hasActiveFilters,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState("");

  const isCurrentSearchSaved = savedSearches.some(
    (s) =>
      JSON.stringify(s.criteria) ===
      JSON.stringify(Object.fromEntries([...filters]))
  );

  const criteria = Object.fromEntries([...filters]);

  const describeCriteria = (c) => {
    const parts = [];
    if (c.keyword) parts.push(`Mot-clé : ${c.keyword}`);
    if (c.minPrice || c.maxPrice) {
      parts.push(`Prix : ${c.minPrice ?? 0}€ — ${c.maxPrice ?? "∞"}€`);
    }
    if (c.address || c.radius) {
      parts.push(
        `Localisation : ${c.address ?? "autour de moi"}${
          c.radius ? ` • ${c.radius} km` : ""
        }`
      );
    }
    if (c.peremptionDate) parts.push(`À consommer avant : ${c.peremptionDate}`);
    if (c.dietaries?.length) parts.push(`Régimes : ${c.dietaries.join(", ")}`);
    return parts.join(" • ");
  };

  function openSaveDialog() {
    setSearchName("");
    setDialogOpen(true);
  }

  async function handleConfirmSave() {
    const canonicalise = (params) => ({
      minPrice: params.get("minPrice") ?? params.get("price_min"),
      maxPrice: params.get("maxPrice") ?? params.get("price_max"),
      address: params.get("address"),
      radius: params.get("radius"),
      peremptionDate:
        params.get("peremptionDate") ?? params.get("expiry_before"),
      dietaries: params.getAll("dietary[]"),
      keyword: params.get("keyword"),
    });

    const criteriaObj = Object.fromEntries(
      Object.entries(canonicalise(filters)).filter(
        ([, v]) => v !== null && v !== "" && v !== "null"
      )
    );

    try {
      await saveSearch(searchName.trim() || "Ma recherche", criteriaObj);
      toast.success("Recherche sauvegardée !");
      setDialogOpen(false);
      fetchSavedSearches();
    } catch (e) {
      toast.error(e.message || "Erreur sauvegarde !");
    }
  }

  function handleLoad(criteria) {
    setShowSavedList(false);

    setTimeout(() => {
      const next = buildSearchParams(new URLSearchParams(), criteria);
      setFilters(next);
      setSearchText(criteria.keyword ?? "");
    }, 0);
  }

  async function handleDelete(id) {
    try {
      await deleteSavedSearch(id);
      toast.info("Recherche supprimée");
      fetchSavedSearches();
    } catch (e) {
      toast.error(e.message || "Erreur suppression");
    }
  }

  return (
    <>
      {hasActiveFilters && !isCurrentSearchSaved && (
        <button
          onClick={openSaveDialog}
          className="p-2 rounded-full hover:bg-gray-200 transition group ml-1"
          title="Sauvegarder la recherche courante"
        >
          <BookmarkPlus className="w-6 h-6 text-gray-500 group-hover:text-pink-600" />
        </button>
      )}

      <button
        onClick={() =>
          setShowSavedList((open) => {
            if (!open) fetchSavedSearches();
            return !open;
          })
        }
        className="p-2 rounded-full hover:bg-gray-200 transition group ml-1"
        title="Voir mes recherches sauvegardées"
      >
        <Bookmark className="w-6 h-6 text-gray-500 group-hover:text-pink-600" />
      </button>

      {showSavedList && (
        <>
          <div className="fixed inset-y-0 right-0 w-80 bg-white z-50 shadow-lg">
            <h3 className="px-4 py-3 font-semibold text-lg border-b">
              Mes recherches
            </h3>

            {savedSearches.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-500">
                Aucune recherche sauvée.
              </p>
            ) : (
              <ul className="divide-y">
                {savedSearches.map((s) => (
                  <li
                    key={s.id}
                    className="relative flex flex-col hover:bg-gray-50 pl-4 pr-9 py-2 group"
                  >
                    <button
                      className="w-full text-left"
                      onClick={() => handleLoad(s.criteria)}
                    >
                      <span className="font-medium">{s.name}</span>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {describeCriteria(s.criteria)}
                      </div>
                    </button>

                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2
               text-gray-400 hover:text-red-500"
                      onClick={() => handleDelete(s.id)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div
            className="fixed inset-0 bg-black opacity-20 z-40"
            onClick={() => setShowSavedList(false)}
          />
        </>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 2,
              boxShadow: 5,
            },
          },
          backdrop: {
            sx: { backgroundColor: "rgba(0,0,0,0.25)" },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Enregistrer la recherche
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            fullWidth
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
          />
        </DialogContent>

        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleConfirmSave}
            disabled={!searchName.trim()}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
