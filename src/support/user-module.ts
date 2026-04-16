export interface DemoUser {
  id: number;
  name: string;
  role: "reader" | "builder";
}

export function createDemoUser(name: string, role: DemoUser["role"]): DemoUser {
  return {
    id: name.length * 10,
    name,
    role
  };
}
