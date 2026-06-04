import { prisma } from "@/lib/client";

export const hospitalService = {
  // ---------------------------- create Hospital ----------------------------
  async createHospital(data: { name: string; address: string; city: string }) {
    const existingHospital = await prisma.hospital.findFirst({
      where: { name: data.name },
    });

    if (existingHospital) {
      throw new Error("Hospital already exists");
    }

    const hospital = await prisma.hospital.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
      },
    });

    return {
      id: hospital.id,
      name: hospital.name,
      address: hospital.address,
      city: hospital.city,
      createdAt: hospital.createdAt,
    };
  },

  // ---------------------------- update Hospital ----------------------------
  async updateHospital(data: {
    id: number;
    name?: string;
    address?: string;
    city?: string;
  }) {
    const existingHospital = await prisma.hospital.findUnique({
      where: { id: data.id },
    });

    if (!existingHospital) {
      throw new Error("Hospital not found");
    }

    // check duplicate name - except the current hospital
    if (data.name) {
      const existingName = await prisma.hospital.findFirst({
        where: {
          name: data.name,
          id: { not: data.id },
        },
      });

      if (existingName) {
        throw new Error("Hospital with this name already exists");
      }
    }

    const updatedHospital = await prisma.hospital.update({
      where: { id: data.id },
      data: {
        name: data.name ?? existingHospital.name,
        address: data.address ?? existingHospital.address,
        city: data.city ?? existingHospital.city,
      },
    });

    return {
      id: updatedHospital.id,
      name: updatedHospital.name,
      address: updatedHospital.address,
      city: updatedHospital.city,
      createdAt: updatedHospital.createdAt,
      updatedAt: updatedHospital.updatedAt,
    };
  },

  // ---------------------------- delete Hospital ----------------------------
  async deleteHospital(data: { id: number }) {
    // find the hospital by ID - which will be deleted
    const hospital = await prisma.hospital.findUnique({
      where: { id: data.id },
    });

    if (!hospital) {
      throw new Error("Hospital not found");
    }

    const hospitalId = hospital.id;

    await prisma.hospital.delete({
      where: { id: hospitalId },
    });

    return {
      id: hospital.id,
      name: hospital.name,
      address: hospital.address,
      city: hospital.city,
      createdAt: hospital.createdAt,
    };
  },

  // ---------------------------- Get All Hospitals ----------------------------
  async getAllHospitals() {
    const hospitals = await prisma.hospital.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (hospitals.length === 0) {
      throw new Error("No hospitals found");
    }

    return hospitals.map((hospital) => ({
      id: hospital.id,
      name: hospital.name,
      address: hospital.address,
      city: hospital.city,
      createdAt: hospital.createdAt,
    }));
  },

  // ---------------------------- Get Hospital By Id ----------------------------
  async getHospitalById(data: { id: number }) {
    const existingHospital = await prisma.hospital.findUnique({
      where: { id: data.id },
    });

    if (!existingHospital) {
      throw new Error("Hospital not found");
    }

    return {
      id: existingHospital.id,
      name: existingHospital.name,
      address: existingHospital.address,
      city: existingHospital.city,
      createdAt: existingHospital.createdAt,
    };
  },
};
