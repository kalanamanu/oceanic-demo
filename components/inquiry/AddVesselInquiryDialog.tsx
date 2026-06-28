"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { UserSelect } from "@/components/inquiry/user-select";
import { CategorySelect } from "@/components/inquiry/category-select";
import { InquiryCategory } from "@/types/inquiry.types";
import { InquiryService } from "@/services/inquiry.service";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface SubPIC {
  userId: string;
  userName: string;
}

interface VesselInquiryDialogProps {
  children: React.ReactNode;
  onInquiryCreated?: () => void;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border bg-background shadow-sm overflow-hidden">
      <div className="border-b px-6 py-4">
        <h3 className="font-semibold text-base">{title}</h3>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}

export function VesselInquiryDialog({
  children,
  onInquiryCreated,
}: VesselInquiryDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [fields, setFields] = React.useState({
    vesselName: "",
    agent: "",
    customer: "",
    customerEmail: "",
    customerContact: "",
    commissionParty: "",
    eta: undefined as Date | undefined,
    port: "",
    categories: [] as any[],
    inquiryReceived: undefined as Date | undefined,

    keyPicUserId: "",
    keyPicUserName: "",
    subPics: [] as SubPIC[],
  });
  const [deadline, setDeadline] = React.useState<string | null>(null);
  const [loadingDeadline, setLoadingDeadline] = React.useState(false);

  //Fetch Deadline
  React.useEffect(() => {
    if (!open) return;

    const fetchDeadline = async () => {
      try {
        setLoadingDeadline(true);

        const result = await InquiryService.getInquiryDeadline();
        setDeadline(result);
      } catch (error: any) {
        toast.error(error.message || "Failed to load deadline");
      } finally {
        setLoadingDeadline(false);
      }
    };

    fetchDeadline();
  }, [open]);

  const handleCategoryChange = (categories: InquiryCategory[]) => {
    setFields((prev) => ({ ...prev, categories }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFields((prev) => ({ ...prev, [name]: date }));
  };

  const handleKeyPicChange = (userId: string, userName: string) => {
    setFields((prev) => ({
      ...prev,
      keyPicUserId: userId,
      keyPicUserName: userName,
    }));
  };

  const handleSubPicChange = (
    idx: number,
    userId: string,
    userName: string,
  ) => {
    setFields((prev) => ({
      ...prev,
      subPics: prev.subPics.map((pic, i) =>
        i === idx ? { userId, userName } : pic,
      ),
    }));
  };

  const handleAddSubPic = () => {
    setFields((prev) => ({
      ...prev,
      subPics: [...prev.subPics, { userId: "", userName: "" }],
    }));
  };

  const handleRemoveSubPic = (idx: number) => {
    setFields((prev) => ({
      ...prev,
      subPics: prev.subPics.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !fields.eta ||
        !fields.inquiryReceived ||
        fields.categories.length === 0
      ) {
        toast.error(
          "Please fill all required fields, including at least one category",
        );
        return;
      }

      if (!deadline) {
        toast.error("Quotation deadline is not available yet");
        return;
      }

      // Transform data to match API format
      const inquiryData = {
        vessel_name: fields.vesselName,
        agent: fields.agent,
        customer: fields.customer,
        customerEmail: fields.customerEmail,
        customerContact: fields.customerContact,
        commissionParty: fields.commissionParty,

        eta: format(fields.eta, "yyyy-MM-dd"),

        port: fields.port,

        categories: fields.categories
          .filter((cat) => cat?.cte_id)
          .map((cat) => ({
            id: cat.cte_id,
            name: cat.cte_name,
          })),

        received_date: format(fields.inquiryReceived, "yyyy-MM-dd"),

        received_time: format(fields.inquiryReceived, "HH:mm"),

        qout_submission_deadline_date: format(new Date(deadline), "yyyy-MM-dd"),

        key_pic_usr_id: fields.keyPicUserId,

        pics: [
          ...(fields.keyPicUserId
            ? [
                {
                  pic_usr_id: fields.keyPicUserId,
                  pic_name: fields.keyPicUserName,
                  is_key_pic: true,
                },
              ]
            : []),

          ...fields.subPics
            .filter((pic) => pic.userId)
            .map((pic) => ({
              pic_usr_id: pic.userId,
              pic_name: pic.userName,
              is_key_pic: false,
            })),
        ],

        status: "Pending",
      };

      await InquiryService.createInquiry(inquiryData);

      toast.success("Inquiry created successfully!");

      // Reset form
      setFields({
        vesselName: "",
        agent: "",
        customer: "",
        customerEmail: "",
        customerContact: "",
        commissionParty: "",
        eta: undefined,
        port: "",
        categories: [],
        inquiryReceived: undefined,
        keyPicUserId: "",
        keyPicUserName: "",
        subPics: [],
      });

      setOpen(false);
      onInquiryCreated?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to create inquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <AnimatePresence>
        {open && (
          <DialogContent
            className="
                w-[70vw]
                max-w-[1600px]
                sm:max-w-[1600px]
                h-[95vh]
                p-0
                overflow-hidden
                rounded-3xl
                border
                shadow-2xl
                forceMount
              "
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="p-8 sm:p-6"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <DialogHeader>
                <DialogTitle>New Vessel Inquiry</DialogTitle>
                <DialogDescription>
                  Fill out the vessel inquiry profile below.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="mt-6">
                <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
                  {/* LEFT SIDE */}
                  <div className="space-y-6">
                    {/* Vessel Information */}
                    <SectionCard title="Vessel Information">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Vessel Name */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Vessel Name <span className="text-red-500">*</span>
                          </label>

                          <input
                            name="vesselName"
                            type="text"
                            placeholder="Enter vessel name"
                            className="w-full border-2 border-input rounded-xl px-3 py-2 bg-background"
                            required
                            value={fields.vesselName}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Agent */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Agent <span className="text-red-500">*</span>
                          </label>

                          <input
                            name="agent"
                            type="text"
                            placeholder="Enter agent"
                            className="w-full border-2 border-input rounded-xl px-3 py-2 bg-background"
                            required
                            value={fields.agent}
                            onChange={handleChange}
                          />
                        </div>

                        {/* ETA */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            ETA <span className="text-red-500">*</span>
                          </label>

                          <DateTimePicker
                            date={fields.eta}
                            onDateChange={(date) =>
                              handleDateChange("eta", date)
                            }
                            placeholder="DD.MM.YYYY HH:MM"
                          />
                        </div>

                        {/* Port */}
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Port <span className="text-red-500">*</span>
                          </label>

                          <input
                            name="port"
                            type="text"
                            placeholder="Enter port"
                            className="w-full border-2 border-input rounded-xl px-3 py-2 bg-background"
                            required
                            value={fields.port}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Inquiry Received */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Inquiry Received
                          </label>

                          <DateTimePicker
                            date={fields.inquiryReceived}
                            onDateChange={(date) =>
                              handleDateChange("inquiryReceived", date)
                            }
                            placeholder="DD.MM.YYYY HH:MM"
                          />
                        </div>

                        {/* Quotation Deadline */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Quotation Deadline
                          </label>

                          <input
                            type="text"
                            disabled
                            value={
                              loadingDeadline
                                ? "Loading..."
                                : deadline
                                  ? format(
                                      new Date(deadline),
                                      "dd.MM.yyyy HH:mm",
                                    )
                                  : "-"
                            }
                            className="w-full border-2 border-input rounded-xl px-3 py-2 bg-muted cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </SectionCard>

                    {/* Customer Information */}
                    <SectionCard title="Customer Information">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Customer
                          </label>

                          <input
                            name="customer"
                            type="text"
                            className="w-full border-2 border-input rounded-xl px-3 py-2 bg-background"
                            value={fields.customer}
                            onChange={handleChange}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Customer Email
                          </label>

                          <input
                            name="customerEmail"
                            type="email"
                            className="w-full border-2 border-input rounded-xl px-3 py-2 bg-background"
                            value={fields.customerEmail}
                            onChange={handleChange}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Customer Contact
                          </label>

                          <input
                            name="customerContact"
                            type="text"
                            className="w-full border-2 border-input rounded-xl px-3 py-2 bg-background"
                            value={fields.customerContact}
                            onChange={handleChange}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Commission Party
                          </label>

                          <input
                            name="commissionParty"
                            type="text"
                            className="w-full border-2 border-input rounded-xl px-3 py-2 bg-background"
                            value={fields.commissionParty}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </SectionCard>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="space-y-6">
                    {/* Categories */}
                    <SectionCard title="Categories">
                      <CategorySelect
                        selectedCategories={fields.categories}
                        onChange={handleCategoryChange}
                      />
                    </SectionCard>

                    {/* PIC Assignment */}
                    <SectionCard title="PIC Assignment">
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Key PIC
                          </label>

                          <UserSelect
                            value={fields.keyPicUserId}
                            onValueChange={handleKeyPicChange}
                            placeholder="Select Key PIC"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium">
                              Sub PICs
                            </label>

                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={handleAddSubPic}
                            >
                              + Add
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {fields.subPics.map((pic, idx) => (
                              <div key={idx} className="flex gap-2">
                                <div className="flex-1">
                                  <UserSelect
                                    value={pic.userId}
                                    onValueChange={(userId, userName) =>
                                      handleSubPicChange(idx, userId, userName)
                                    }
                                    placeholder={`Sub PIC #${idx + 1}`}
                                  />
                                </div>

                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleRemoveSubPic(idx)}
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Actions */}
                    <SectionCard title="Actions">
                      <div className="space-y-3">
                        <Button
                          type="submit"
                          className="w-full h-11 rounded-xl"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Inquiry"
                          )}
                        </Button>

                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            className="w-full h-11 rounded-xl"
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                      </div>
                    </SectionCard>
                  </div>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
