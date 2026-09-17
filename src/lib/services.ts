import "server-only";
import { getDb } from "@/lib/db";
import { SERVICE_GROUPS, type Service, type ServiceGroup, type ServiceInput } from "@/lib/service-constants";

export { SERVICE_GROUPS };
export type { Service, ServiceGroup, ServiceInput };

type ServiceRow = {
  id: number;
  group_id: string;
  title: string;
  description: string;
  price: string;
  sort_order: number;
};

function rowToService(row: ServiceRow): Service {
  return {
    id: row.id,
    group: row.group_id as ServiceGroup,
    title: row.title,
    desc: row.description,
    price: row.price,
    sortOrder: row.sort_order,
  };
}

// ---------- Public reads ----------

export async function getServicesByGroup(group: ServiceGroup): Promise<Service[]> {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM services WHERE group_id = ? ORDER BY sort_order ASC, id ASC")
    .all(group) as ServiceRow[];
  return rows.map(rowToService);
}

// ---------- Admin reads (used only behind a verified session) ----------

export async function getAllServicesForAdmin(): Promise<Service[]> {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM services ORDER BY group_id ASC, sort_order ASC, id ASC")
    .all() as ServiceRow[];
  return rows.map(rowToService);
}

export async function getServiceByIdForAdmin(id: number): Promise<Service | null> {
  const db = getDb();
  const row = db.prepare("SELECT * FROM services WHERE id = ?").get(id) as ServiceRow | undefined;
  return row ? rowToService(row) : null;
}

// ---------- Writes (always called from a session-verified Server Action) ----------

export async function createService(input: ServiceInput): Promise<Service> {
  const db = getDb();
  const info = db
    .prepare(
      `INSERT INTO services (group_id, title, description, price, sort_order)
       VALUES (@group, @title, @desc, @price, @sortOrder)`
    )
    .run(input);
  const service = await getServiceByIdForAdmin(Number(info.lastInsertRowid));
  if (!service) throw new Error("Không thể tạo dịch vụ.");
  return service;
}

export async function updateService(id: number, input: ServiceInput): Promise<Service> {
  const db = getDb();
  db.prepare(
    `UPDATE services SET group_id = @group, title = @title, description = @desc,
       price = @price, sort_order = @sortOrder WHERE id = @id`
  ).run({ ...input, id });
  const service = await getServiceByIdForAdmin(id);
  if (!service) throw new Error("Không tìm thấy dịch vụ để cập nhật.");
  return service;
}

export async function deleteService(id: number): Promise<Service | null> {
  const service = await getServiceByIdForAdmin(id);
  if (!service) return null;
  getDb().prepare("DELETE FROM services WHERE id = ?").run(id);
  return service;
}
