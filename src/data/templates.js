// Définition des modèles de titres et des catégories de modèles
export const templates = [
    {
      id: 'h2-empty',
      name: '== Titre de la recette',
      type: 'h2',
      heading: '== Votre Recette'
    },
    {
      id: 'h3-empty',
      name: '=== Sous-section',
      type: 'h3',
      heading: '=== Votre Sous-Section'
    },
    {
      id: 'custom-empty',
      name: 'Fiche vide',
      type: 'test',
      fields: {
        id: '',
        title: '',
        scope: '',
        objective: '',
        code_content: '',
        expected_result: '',
      },
    },
  ];
  
export const templateCategories = [
    {
      id: 'hardware-recipe',
      name: 'Recette Matérielle',
      templates: [
        {
          id: 'processors',
          name: 'Processeurs',
          type: 'test',
          fields: {
            id: 'HW001',
            title: 'Conformité processeurs des nœuds de calcul standard',
            scope: 'compute[001-500]',
            objective: 'Vérifier que les processeurs livrés sont conformes à la commande',
            code_content: `clush -bw compute[001-500] \
"echo \"Core Count: 
$(sudo dmidecode -t processor | grep 'Core Count' | awk '{print $3}' | paste -sd ', ') | \
Current Speed: 
$(sudo dmidecode -t processor | grep 'Current Speed' | awk '{print $3, $4}' | paste -sd ', ') | \
Version: 
$(sudo dmidecode -t processor | grep 'Version' | awk -F': ' '{print $2}' | sort -u | paste -sd ', ')\""`,
            expected_result: 'CPU AMD Genoa 9554 64c 3.1Ghz 360W',
          },
        },
        {
          id: 'memory',
          name: 'Mémoire',
          type: 'test',
          fields: {
            id: 'HW002',
            title: 'Conformité mémoire des nœuds de calcul',
            scope: 'compute[001-500]',
            objective: 'Vérifier la quantité et la vitesse de la mémoire RAM installée',
            code_content: `clush -bw compute[001-500] "sudo dmidecode -t memory"`,
            expected_result: 'RAM 128GB DDR4 3200Mhz',
          },
        },
      ]
    },
    {
      id: 'functional-recipe',
      name: 'Recette Fonctionnelle',
      templates: [
        {
          id: 'network-connectivity',
          name: 'Connectivité réseau d\'administration',
          type: 'test',
          fields: {
            id: 'FUNC001',
            title: 'Vérification de la connectivité réseau',
            scope: 'compute[001-500]',
            objective: 'Vérifier que les nœuds peuvent communiquer avec le réseau d\'administration',
            code_content: `clush -bw compute[001-500] "ping -c 3 admin-server"`,
            expected_result: '3 paquets transmis, 3 reçus, 0% de perte de paquets',
          },
        },
        {
          id: 'node-deployment',
          name: 'Déploiement des nœuds',
          type: 'test',
          fields: {
            id: 'FUNC002',
            title: 'Déploiement des nœuds',
            scope: 'compute[001-500]',
            objective: 'Vérifier que les nœuds sont correctement déployés et fonctionnels',
            code_content: `clush -bw compute[001-500] "systemctl status compute-service"`,
            expected_result: 'service actif et en cours d\'exécution',
          },
        },
      ]
    },
    {
      id: 'security-recipe',
      name: 'Recette Sécurité',
      templates: [
        {
          id: 'admin-access',
          name: 'Accès aux interfaces d\'administration',
          type: 'test',
          fields: {
            id: 'SEC001',
            title: 'Vérification de l\'accès sécurisé aux interfaces d\'administration',
            scope: 'cluster',
            objective: 'Vérifier que l\'accès est restreint aux utilisateurs autorisés',
            code_content: `ssh non_admin_user@admin-server "echo 'Attempting access...'"`,
            expected_result: 'Permission refusée',
          },
        },
      ]
    },
    {
      id: 'datacenter-recipe',
      name: 'Recette Datacenter',
      templates: [
        {
          id: 'datacenter-network',
          name: 'Réseau datacenter',
          type: 'test',
          fields: {
            id: 'DC001',
            title: 'Test de connectivité réseau du datacenter',
            scope: 'datacenter',
            objective: 'Vérifier la connectivité entre les différents équipements du datacenter',
            code_content: `ping -c 4 switch-core-01`,
            expected_result: '4 paquets transmis, 4 reçus, 0% de perte de paquets',
          },
        },
      ]
    }
  ];

export const testTableTemplate = `
[cols="3,8a",options="header",separator="¦"]
¦===
¦Id ¦ {id}
¦Intitulé du test ¦ {title}
¦Périmètre ¦ {scope}
¦Objectifs ¦ {objective}

¦Opérations a¦
[source,bash,subs=+attributes]
----
{code_content}
----

¦Résultat attendu ¦ {expected_result}

2+¦Résultat obtenu
2+a¦
[source]
----
(collez ici la sortie réelle après exécution)
----

¦Valide (Oui / Non) ¦ 
¦Commentaire ¦ 
¦===
`;
