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
import { motion, AnimatePresence } from "framer-motion";

export function VesselInquiryDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  const [fields, setFields] = React.useState({
    vesselName: "",
    agent: "",
    eta: undefined as Date | undefined,
    port: "",
    category: "",
    inquiryReceived: undefined as Date | undefined,
    quotationSubmission: undefined as Date | undefined,
    keyPic: "",
    subPics: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("subPic-")) {
      const idx = parseInt(name.split("-")[1], 10);
      setFields((prev) => ({
        ...prev,
        subPics: prev.subPics.map((pic, i) => (i === idx ? value : pic)),
      }));
    } else {
      setFields({ ...fields, [name]: value });
    }
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFields((prev) => ({ ...prev, [name]: date }));
  };

  const handleAddSubPic = () => {
    setFields((prev) => ({ ...prev, subPics: [...prev.subPics, ""] }));
  };

  const handleRemoveSubPic = (idx: number) => {
    setFields((prev) => ({
      ...prev,
      subPics: prev.subPics.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted data:", fields);
    // Add  submission logic here
    setOpen(false);
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
                    placeholder="Bonded, Provisions, Deck/Engine"
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
                  <label className="block text-sm font-medium mb-1">
                    Key PIC
                  </label>
                  <input
                    name="keyPic"
                    type="text"
                    className="w-full border-2 border-input rounded px-3 py-2 bg-background text-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={fields.keyPic}
                    onChange={handleChange}
                    placeholder="Key Person in Charge"
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
                    {(fields.subPics || []).map((pic, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 mb-2"
                      >
                        <input
                          name={`subPic-${idx}`}
                          type="text"
                          className="w-full border-2 border-input rounded px-3 py-2 bg-background text-foreground hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          value={pic}
                          onChange={handleChange}
                          placeholder={`Sub PIC #${idx + 1}`}
                        />
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
                  <Button type="submit" className="cursor-pointer">
                    Create Inquiry
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
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
