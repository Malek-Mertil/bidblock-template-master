"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import mutate from "../mutate";
import { TicketForm } from "@/types/tables/ticket";
import { TicketStatus } from "@/enums/TicketStatus";

// Zod schema for validation
const ticketSchema = z.object({
  description: z.string().max(1000, { message: "Description must be less than 1000 characters" }).optional(),

  event: z.string().min(1, { message: "event is required" }).max(50, { message: "event cannot exceed 50 characters" }),
  ticketType: z
    .string()
    .min(1, { message: "Ticket Type is required" })
    .max(50, { message: "Ticket Type cannot exceed 50 characters" }),
  ticketFormat: z
    .string()
    .min(1, { message: "Ticket Format is required" })
    .max(50, { message: "Ticket Format cannot exceed 50 characters" }),
  quantity: z
    .number()
    .int()
    .min(1, { message: "Quantity must be at least 1" })
    .max(10000, { message: "Quantity cannot exceed 10,000" }),

  price: z.number().min(0.01, { message: "Price must be at least 0.01" }).max(100000, { message: "Price cannot exceed 100,000" }),

  expirationDate: z
    .string()
    .datetime({ message: "Expiration date must be a valid ISO 8601 date" })
    .optional()
    .refine((date) => !date || new Date(date) > new Date(), {
      message: "Expiration date must be in the future",
    }),

  status: z
    .nativeEnum(TicketStatus, {
      message: "Invalid status value",
    })
    .optional(),
});
export async function postTicket(state: TicketForm, formData: FormData): Promise<TicketForm> {
  // Extract form data
  const rawData = {
    id: formData.get("id") as string,
    description: formData.get("description") as string,
    expirationDate: formData.get("expirationDate") as string,
    event: formData.get("event") as string,
    currency: formData.get("currency") as string,
    ticketType: formData.get("ticketType") as string,
    ticketFormat: formData.get("ticketFormat") as string,
    status: formData.get("status") as string,
    price: formData.get("price") as string,
    quantity: formData.get("quantity") as string,
  };

  // Helper function to generate the state object
  const generateState = (errors: Record<string, string[]> = {}, globalError?: string, successMessage?: string): TicketForm => ({
    id: { value: rawData.id, errors: [] },
    description: { value: rawData.description, errors: errors.description || [] },
    expirationDate: { value: rawData.expirationDate, errors: errors.expirationDate || [] },
    event: { value: rawData.event, errors: errors.event || [] },
    currency: { value: rawData.currency, errors: errors.currency || [] },
    ticketType: { value: rawData.ticketType, errors: errors.ticketType || [] },
    ticketFormat: { value: rawData.ticketFormat, errors: errors.ticketFormat || [] },
    status: { value: rawData.status, errors: errors.status || [] },
    price: { value: rawData.price, errors: errors.price || [] },
    quantity: { value: rawData.quantity, errors: errors.quantity || [] },
    globalError,
    successMessage,
  });
  let id = "";
  try {
    // Validate form data using Zod schema
    const validatedData = ticketSchema.safeParse(rawData);
    // If validation fails, return the state with validation errors
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;

      return generateState(errors, "Validation failed. Please check the form fields.");
    }

    const response = await mutate<{ _id: string }>(`/tickets${rawData.id ? "/" + rawData.id : ""}`, rawData.id ? "PUT" : "POST", {
      description: rawData.description,
      expirationDate: rawData.expirationDate,
      event: rawData.event,
      currency: rawData.currency,
      ticketType: rawData.ticketType,
      ticketFormat: rawData.ticketFormat,
      status: rawData.status,
      price: rawData.price,
      quantity: rawData.quantity,
    });

    if (response.status !== "SUCCESS") {
      // Handle backend validation errors
      if (response.status === "NOT-ALLOWED") {
        return generateState({}, "You are not allowed to do this action");
      } else if (response.status === "VALIDATION-ERROR") {
        return generateState(response.errors, "Validation failed. Please check the form fields.");
      }
      return generateState({}, "An unexpected error occurred.");
    }
    // Return success state with a success message
    if (rawData.id) {
      return generateState({}, undefined, "Ticket saved successfully!");
    }

    id = response.data._id;
  } catch (e) {
    console.error("EVENT CREATION ERROR === >>> ", e);
    return generateState({}, "An unexpected error occurred.");
  }
  redirect(`/admin/tickets/manage-tickets/${id}?SUCCESS=Ticket saved successfully!`);
}
