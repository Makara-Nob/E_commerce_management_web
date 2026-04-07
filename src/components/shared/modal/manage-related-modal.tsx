import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductModel } from "@/models/dashboard/master-data/product/product.response.model";
import {
  updateProductService,
  getProductsService,
} from "@/services/dashboard/product/product.service";
import { AppToast } from "@/components/shared/common/app-toast";
import { Loader2, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/utils/debounce/debounce";

interface ManageRelatedProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductModel | null;
  onSuccess: () => void;
}

export function ManageRelatedProductsModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ManageRelatedProductsModalProps) {
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [searchResults, setSearchResults] = useState<ProductModel[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedProductIds(product.relatedProducts || []);
      setSearch("");
      setSearchResults([]);
    }
  }, [product, isOpen]);

  useEffect(() => {
    async function searchProducts() {
      if (!debouncedSearch) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await getProductsService(1, 10, debouncedSearch);
        // Filter out the current product itself
        const filtered = response.content.filter(
          (p) => p.id !== product?.id
        );
        setSearchResults(filtered);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsSearching(false);
      }
    }

    if (isOpen) {
      searchProducts();
    }
  }, [debouncedSearch, product, isOpen]);

  const handleToggleProduct = (id: string | number) => {
    const numId = Number(id);
    setSelectedProductIds((prev) =>
      prev.includes(numId)
        ? prev.filter((pId) => pId !== numId)
        : [...prev, numId]
    );
  };

  const handleSave = async () => {
    if (!product) return;

    setIsSubmitting(true);
    try {
      await updateProductService(product.id, {
        ...product,
        relatedProducts: selectedProductIds,
      } as any);

      AppToast({
        type: "success",
        message: "Related products updated successfully",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      AppToast({
        type: "error",
        message: error?.message || "Failed to update related products",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Related Products</DialogTitle>
          <DialogDescription>
            Select products that are related to <strong>{product?.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden py-2">
          {/* Search */}
          <div>
            <Input
              placeholder="Search products by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-4 h-full min-h-[300px] overflow-hidden">
            {/* Search Results */}
            <div className="flex-1 flex flex-col border rounded-md">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-b">
                Search Results {isSearching && <Loader2 className="inline w-3 h-3 animate-spin ml-2" />}
              </div>
              <ScrollArea className="flex-1 h-[250px]">
                {searchResults.length > 0 ? (
                  <div className="p-2 space-y-1">
                    {searchResults.map((item) => {
                      const numId = Number(item.id);
                      const isSelected = selectedProductIds.includes(numId);
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-2 text-sm rounded-md border ${
                            isSelected ? "bg-primary/5 border-primary/20" : "bg-card hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="truncate">{item.name}</span>
                            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {item.sku}
                            </span>
                          </div>
                          {!isSelected ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 shrink-0"
                              onClick={() => handleToggleProduct(item.id)}
                            >
                              <Plus className="w-4 h-4 text-primary" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 shrink-0"
                              onClick={() => handleToggleProduct(item.id)}
                            >
                              <X className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4 text-center">
                    {search ? "No products found." : "Type to search products..."}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Selected Summary */}
            <div className="w-[180px] flex flex-col border rounded-md bg-muted/20">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-b flex justify-between">
                <span>Selected</span>
                <Badge variant="secondary" className="text-[10px]">
                  {selectedProductIds.length}
                </Badge>
              </div>
              <ScrollArea className="flex-1 p-2 h-[250px]">
                {selectedProductIds.length > 0 ? (
                  <div className="space-y-1">
                    {selectedProductIds.map((id) => (
                      <div key={id} className="flex items-center justify-between p-1.5 bg-background border rounded text-xs">
                        <span className="truncate">ID: {id}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-destructive shrink-0"
                          onClick={() => handleToggleProduct(id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-muted-foreground p-2 text-center">
                    No related products selected.
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-auto">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Save Relations"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


