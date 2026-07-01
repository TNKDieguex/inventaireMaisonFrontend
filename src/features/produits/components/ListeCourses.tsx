import { useState, useEffect, useMemo } from 'react';
import type {ManualItem, ProduitDto, ShoppingListItem} from '../types';
import { getFamilleIdFromToken, getValidCachedProduits, getShoppingListFromCache, saveShoppingListToCache } from '../../../utils/jwtUtils';
import Button from '../../../components/Button';
import FormInputs from '../../../components/FormInputs';
import {calculerJoursRestants} from "../../../utils/ExportMethodes.ts";
import {useNavigate} from "react-router-dom";

const ListeCourses = () => {
  const [familleUuid] = useState<string | null>(() => {
    const token = localStorage.getItem('token');
    return token ? getFamilleIdFromToken(token) : null;
  });
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    if (!familleUuid) return new Set();
    const { checkedItems: savedChecked } = getShoppingListFromCache(familleUuid);
    return new Set(savedChecked);
  });
  const navigate = useNavigate();
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newItem, setNewItem] = useState({ nom: '', quantite: 1 });

  useEffect(() => {
    const loadShoppingList = () => {
      if (!familleUuid) return;

      const cachedProduits = getValidCachedProduits(familleUuid) || [];

      const filteredList = cachedProduits.filter(p => {
        const stockFaible = p.quantite <= p.quantiteMinimal;
        let pourDate = false;

        if (p.dateLimiteConsommation) {
          const joursRestants = calculerJoursRestants(p.dateLimiteConsommation);
          pourDate = joursRestants <= 7;
        }

        return stockFaible || pourDate;
      }).map(p => ({ ...p, id: p.uuid }));

      const { manualItems: savedManualItems } = getShoppingListFromCache(familleUuid);

      setShoppingList([...filteredList, ...savedManualItems]);
      setIsLoaded(true);
    };

    loadShoppingList();
  }, [familleUuid]);

  useEffect(() => {
    if (!familleUuid || !isLoaded) return;

    const manualItems = shoppingList.filter(item => 'manual' in item && item.manual) as ManualItem[];
    saveShoppingListToCache(familleUuid, manualItems, checkedItems);
  }, [checkedItems, shoppingList, familleUuid, isLoaded]);

  const handleCheck = (id: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(id)) {
      newCheckedItems.delete(id);
    } else {
      newCheckedItems.add(id);
    }
    setCheckedItems(newCheckedItems);
  };

  const handleAddItem = () => {
    if (newItem.nom.trim() === '') return;
    const manualItem: ManualItem = {
      ...newItem,
      id: `manual-${Date.now()}`,
      manual: true,
    };
    setShoppingList(prev => [...prev, manualItem]);
    setNewItem({ nom: '', quantite: 1 });
    setIsModalOpen(false);
  };

  const handleRemoveManualItem = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
    if (checkedItems.has(id)) {
      const newChecked = new Set(checkedItems);
      newChecked.delete(id);
      setCheckedItems(newChecked);
    }
  };

  const handleClearList = () => {
    setCheckedItems(new Set());
    setShoppingList(prev => prev.filter(item => !('manual' in item)));
    setEditMode(false);
  };

  const handleRetourner = () => {
    navigate('/dashboard');
  }

  const sortedList = useMemo(() => {
    return [...shoppingList].sort((a, b) => {
      const aChecked = checkedItems.has(a.id);
      const bChecked = checkedItems.has(b.id);
      if (aChecked === bChecked) return 0;
      return aChecked ? 1 : -1;
    });
  }, [shoppingList, checkedItems]);

  return (
      <div className="dashboard-screen">
        <div className="dashboard-titre flex flex-row gap-2">
          <Button
              type="button"
              variant="secondary"
              size={"sm"}
              onClick={handleRetourner}
          >
            <svg className={"size-5"}>
              <use href="/sprite.svg#arrowLeft" />
            </svg>
          </Button>
          <h1>
          Liste de Courses</h1>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm select-none pointer-events-auto">
            <div className={"max-w-xs w-full bg-blue-haze-200 p-8 rounded-2xl " +
                "shadow-2xl  flex flex-col text-center items-center " +
                "space-y-6 border border-gray-100"}>
              <h2 className="titre mb-0">Ajouter manuellement</h2>
              <div className="">
                <FormInputs
                    label="Nom du produit"
                    name="nom"
                    type="text"
                    placeholder="ex: Tomates"
                    value={newItem.nom}
                    onChange={(e) => setNewItem({ ...newItem, nom: e.target.value })}
                />
                <FormInputs
                    label="Quantité"
                    name="quantite"
                    type="number"
                    placeholder="1"
                    value={newItem.quantite}
                    onChange={(e) => setNewItem({ ...newItem, quantite: parseInt(e.target.value, 10) || 1 })}
                />
              </div>
              <div className="p-2 flex flex-row gap-2">
                <Button onClick={handleAddItem} variant={"primary"} fullWidth>
                  Ajouter
                </Button>
                <Button onClick={() => setIsModalOpen(false)} variant="outline" fullWidth>
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="dashboard-screen-enfant">
          {sortedList.length === 0 ? (
              <div className="information-div space-y-2">
                <p className="text-gray-500 text-sm italic py-1">Tout est sous contrôle ! Aucun produit à acheter.</p>
              </div>
          ) : (
            <div className={"space-y-1.5 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-haze-400"}>
              <ul className="space-y-3 p-0 m-0 list-none">
                {sortedList.map(item => {
                  const isChecked = checkedItems.has(item.id);
                  const isManual = 'manual' in item && item.manual;

                  const joursRestants = !isManual && (item as ProduitDto).dateLimiteConsommation
                      ? calculerJoursRestants((item as ProduitDto).dateLimiteConsommation)
                      : null;

                  return (
                    <li key={item.id} className={`flex items-center justify-between p-4 bg-white rounded-xl border transition-all duration-200 shadow-sm
                    ${isChecked ? 'opacity-40 bg-slate-100/50  border-slate-200 line-through text-slate-400' 
                        : 'border-slate-100 '}`}>
                      <div className="flex items-center gap-3 flex-1">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheck(item.id)}
                            className="size-5 rounded border-slate-300 text-blue-haze-600 focus:ring-blue-haze-500 cursor-pointer accent-blue-haze-600"
                        />
                        <div className="flex flex-col">
                          <span className={`font-semibold text-sm ${isChecked ? 'text-slate-400' : 'text-slate-800 '}`}>
                            {item.nom}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            {isManual ? 'Manuel' : (item as ProduitDto).categorieProduit}
                          </span>
                        </div>
                      </div>

                      <div className={"flex flex-row gap-3 items-center"}>
                        <div className="flex flex-col items-end gap-3">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100  text-slate-700 ">
                            Qté: {item.quantite}
                          </span>
                          {joursRestants !== null && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  isChecked
                                      ? 'produit-date'
                                      : joursRestants < 0
                                          ? 'produit-perime'
                                          : 'produit-proche'
                              }`}>
                                  {joursRestants < 0 ? 'Périmé' : `Exp: ${(item as ProduitDto).dateLimiteConsommation}`}
                                </span>
                          )}

                        </div>
                          {editMode && isManual && (
                            <Button onClick={() => handleRemoveManualItem(item.id)} variant="danger" size="sm">
                              <svg className={"size-5"}><use href={"/sprite.svg#trash"}/></svg>
                            </Button>
                          )}
                      </div>

                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div className="flex relative mb-4 justify-between">
            <Button onClick={() => setIsModalOpen(true)}>Ajouter</Button>
            <Button onClick={() => setEditMode(!editMode)} variant={editMode ? 'confirm' : 'secondary'}>
              {editMode ? 'Terminer' : 'Modifier'}
            </Button>
            {shoppingList.length > 0 && (
                <Button onClick={handleClearList} variant="danger">Vider</Button>
            )}
          </div>
        </div>
      </div>
  );
};

export default ListeCourses;