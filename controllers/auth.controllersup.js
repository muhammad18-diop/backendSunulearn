import { supabase } from "../config/supabase.js";

// INSCRIPTION
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name, 
      },
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({
    message: "Utilisateur créé",
    user: data.user,
  });
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({
    message: "Connexion réussie",
    user: data.user,
    session: data.session,
  });
};