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

export function VesselInquiryDialog({
  children,
  onInquiryCreated,
}: VesselInquiryDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [fields, setFields] = React.useState({
    vesselName: "",
    agent: "",
    eta: undefined as Date | undefined,
    port: "",
    category: "",
    inquiryReceived: undefined as Date | undefined,
    quotationSubmission: undefined as Date | undefined,
    keyPicUserId: "",
    subPics: [] as SubPIC[],
  });

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
    setFields((prev) => ({ ...prev, keyPicUserId: userId }));
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
      if (!fields.eta || !fields.inquiryReceived) {
        toast.error("Please fill all required fields");
        return;
      }

      // Transform data to match API format
      const inquiryData = {
        vessel_name: fields.vesselName,
        agent: fields.agent,
        eta: format(fields.eta, "yyyy-MM-dd"),
        port: fields.port,
        category: fields.category,
        received_date: format(fields.inquiryReceived, "yyyy-MM-dd"),
        received_time: format(fields.inquiryReceived, "HH:mm"),
        quote_submission_deadline_date: fields.quotationSubmission
          ? format(fields.quotationSubmission, "yyyy-MM-dd")
          : undefined,
        key_pic_usr_id: fields.keyPicUserId,
        pics: fields.subPics
          .filter((pic) => pic.userId) // Only include PICs with selected users
          .map((pic) => ({
            pic_usr_id: pic.userId,
            pic_name: pic.userName,
          })),
      };

      await InquiryService.createInquiry(inquiryData);
      toast.success("Inquiry created successfully!");

      // Reset form
      setFields({
        vesselName: "",
        agent: "",
        eta: undefined,
        port: "",
        category: "",
        inquiryReceived: undefined,
        quotationSubmission: undefined,
        keyPicUserId: "",
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
            className="max-w-2xl mx-auto p-0 rounded-xl shadow-lg overflow-hidden"
            style={{ maxHeight: "90vh" }}
            forceMount
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

              <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-1">
                    Vessel Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="vesselName"
                    type="text"
                    placeholder="Enter vessel name (e.g., MV Ocean Star)"
                    className="w-full border-2 border-input rounded px-3 py-2 bg-background text-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                    value={fields.vesselName}
                    onChange={handleChange}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-1">
                    Agent <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="agent"
                    type="text"
                    placeholder="Enter agent company name"
                    className="w-full border-2 border-input rounded px-3 py-2 bg-background text-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                    value={fields.agent}
                    onChange={handleChange}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2">
                    ETA <span className="text-red-500">*</span>
                  </label>
                  <DateTimePicker
                    date={fields.eta}
                    onDateChange={(date) => handleDateChange("eta", date)}
                    placeholder="DD.MM.YYYY HH:MM"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-1">
                    Port <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="port"
                    type="text"
                    placeholder="Enter port name (e.g., Colombo)"
                    className="w-full border-2 border-input rounded px-3 py-2 bg-background text-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                    value={fields.port}
                    onChange={handleChange}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="category"
                    type="text"
                    placeholder="Enter vessel category (e.g., Container, Bulk Carrier)"
                    className="w-full border-2 border-input rounded px-3 py-2 bg-background text-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                    value={fields.category}
                    onChange={handleChange}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2">
                    Inquiry Received Date & Time{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <DateTimePicker
                    date={fields.inquiryReceived}
                    onDateChange={(date) =>
                      handleDateChange("inquiryReceived", date)
                    }
                    placeholder="DD.MM.YYYY HH:MM"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2">
                    Quotation Submission Deadline
                  </label>
                  <DateTimePicker
                    date={fields.quotationSubmission}
                    onDateChange={(date) =>
                      handleDateChange("quotationSubmission", date)
                    }
                    placeholder="DD.MM.YYYY HH:MM"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2">
                    Key PIC <span className="text-red-500">*</span>
                  </label>
                  <UserSelect
                    value={fields.keyPicUserId}
                    onValueChange={handleKeyPicChange}
                    placeholder="Select Key Person in Charge"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2">
                    Sub PICs
                  </label>
                  <AnimatePresence mode="popLayout">
                    {fields.subPics.map((pic, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 mb-2"
                      >
                        <div className="flex-1">
                          <UserSelect
                            value={pic.userId}
                            onValueChange={(userId, userName) =>
                              handleSubPicChange(idx, userId, userName)
                            }
                            placeholder={`Select Sub PIC #${idx + 1}`}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveSubPic(idx)}
                          title="Remove Sub PIC"
                          className="bg-red-600 text-white hover:bg-red-500 transition-colors cursor-pointer dark:bg-red-900 dark:hover:bg-red-800"
                        >
                          &times;
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <Button
                    className="text-foreground dark:text-white hover:bg-foreground/10 hover:text-foreground dark:hover:text-white cursor-pointer"
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSubPic}
                  >
                    + Add Sub PIC
                  </Button>
                </motion.div>

                <DialogFooter className="mt-6 flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer"
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
                      disabled={loading}
                      className="text-foreground dark:text-white hover:bg-foreground/10 hover:text-foreground dark:hover:text-white cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
