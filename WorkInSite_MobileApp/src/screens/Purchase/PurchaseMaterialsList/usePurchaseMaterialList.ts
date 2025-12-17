import { Alert } from "react-native";
import { useRef, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { PurchaseMaterialCreationListProps, PurchaseMaterialUpdationListProps } from "../DTOs/PurchaseMaterialProps";

export const usePurchaseMaterialList = (props: {
  newPurchaseMaterials: PurchaseMaterialCreationListProps[];
  setNewPurchaseMaterials: React.Dispatch<React.SetStateAction<PurchaseMaterialCreationListProps[]>>;
  updatedPurchaseMaterials?: PurchaseMaterialUpdationListProps[];
  setUpdatedPurchaseMaterials?: React.Dispatch<React.SetStateAction<PurchaseMaterialUpdationListProps[]>>;
  removedPurchaseMaterialIds?: number[];
  setRemovedPurchaseMaterialIds?: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const {
    newPurchaseMaterials,
    setNewPurchaseMaterials,
    updatedPurchaseMaterials = [],
    setUpdatedPurchaseMaterials,
    removedPurchaseMaterialIds = [],
    setRemovedPurchaseMaterialIds,
  } = props;

  const { t } = useLanguage();
  const bottomSheetRef = useRef<any>(null);

  type CombinedItem = {
    index: number;
    value: PurchaseMaterialCreationListProps | PurchaseMaterialUpdationListProps;
    source: "new" | "update";
  };
  const [selectedItem, setSelectedItem] = useState<CombinedItem | null>(null);

  const handleEdit = (
    item: PurchaseMaterialCreationListProps | PurchaseMaterialUpdationListProps
  ) => {
    let index = 0;
    let source: "new" | "update" = "new";
  const purchaseMaterialId = "purchaseMaterialId" in item
      ? item.purchaseMaterialId
      : "id" in item
        ? (item as any).id
        : undefined;

    if (purchaseMaterialId) {
      source = "update";
      index = updatedPurchaseMaterials.findIndex(
        (m) => m.purchaseMaterialId === purchaseMaterialId
      );
    } else {
      index = newPurchaseMaterials.indexOf(item as PurchaseMaterialCreationListProps);
    }

    setSelectedItem({ index, value: { ...item, purchaseMaterialId }, source });

    setTimeout(() => {
      bottomSheetRef.current?.open();
    }, 10);
  };

  const handleDelete = (
    item: PurchaseMaterialCreationListProps | PurchaseMaterialUpdationListProps
  ) => {
    Alert.alert(t("Confirm Delete"), t("Are you sure you want to delete this material?"), [
      { text: t("Cancel"), style: "cancel" },
      {
        text: t("Delete"),
        style: "destructive",
        onPress: () => {
          const purchaseMaterialId = "purchaseMaterialId" in item
            ? item.purchaseMaterialId
            : "id" in item
              ? (item as any).id
              : undefined;

          if (purchaseMaterialId) {
            if (setUpdatedPurchaseMaterials) {
              const updated = [...updatedPurchaseMaterials];
              const idx = updated.findIndex((m) => m.purchaseMaterialId === purchaseMaterialId);
              if (idx !== -1) updated.splice(idx, 1);
              setUpdatedPurchaseMaterials?.(updated);
            }
            setRemovedPurchaseMaterialIds?.([...removedPurchaseMaterialIds, purchaseMaterialId]);
          } else {
            const updated = [...newPurchaseMaterials];
            const idx = updated.indexOf(item as PurchaseMaterialCreationListProps);
            if (idx !== -1) updated.splice(idx, 1);
            setNewPurchaseMaterials(updated);
          }
        },
      },
    ]);
  };

  return {
    bottomSheetRef,
    selectedItem,
    handleEdit,
    handleDelete,
    setSelectedItem,
  };
};
